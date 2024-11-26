import sqlite3
import xml.etree.ElementTree as ET
import os




####### Script to parse award xml files and insert the data into a sqlite database

with sqlite3.connect("Awards.db") as connection:
    cursor = connection.cursor()

    cursor.execute("CREATE TABLE IF NOT EXISTS awards (awardID TEXT, title TEXT, effectiveDate TEXT, expDate TEXT, amount REAL, instrument TEXT, programOfficer TEXT, institution TEXT, zipCode TEXT, state TEXT, country TEXT, org_abbr TEXT, org_name TEXT)")
    cursor.execute("CREATE TABLE IF NOT EXISTS investigators (awardID TEXT, name TEXT, roleCode TEXT, FOREIGN KEY (awardID) REFERENCES awards (awardID))")
    cursor.execute("CREATE TABLE IF NOT EXISTS programElement (awardID TEXT, code TEXT, text TEXT, FOREIGN KEY (awardID) REFERENCES awards (awardID))")
    cursor.execute("CREATE TABLE IF NOT EXISTS programReference (awardID TEXT, code TEXT, text TEXT, FOREIGN KEY (awardID) REFERENCES awards (awardID))")

    path = 'awards'

    for folder in os.listdir(path):
        folder_path = os.path.join(path, folder)
        if not os.path.isdir(folder_path):
            continue
        if int(folder) != 2009:
            continue
        print(f"Processing {folder_path}")
        for filename in os.listdir(folder_path):
            if not filename.endswith('.xml'):
                continue
            fullname = os.path.join(folder_path, filename)
            try:

                tree = ET.parse(fullname)
                root = tree.getroot().find("Award")

                awardid = root.find("AwardID").text if root.find("AwardID") is not None else 0
                title = root.find("AwardTitle").text if root.find("AwardTitle") is not None else None
                effectiveDate = root.find("AwardEffectiveDate").text if root.find("AwardEffectiveDate") is not None else None
                expDate = root.find("AwardExpirationDate").text if root.find("AwardExpirationDate") is not None else None
                amount = root.find("AwardAmount").text if root.find("AwardAmount") is not None else None
                instrument = root.find("AwardInstrument").find("Value").text if root.find("AwardInstrument") is not None and root.find("AwardInstrument").find("Value") is not None else None
                programOfficer = root.find("ProgramOfficer").find("SignBlockName").text if root.find("ProgramOfficer") is not None and root.find("ProgramOfficer").find("SignBlockName") is not None else None
                institution = root.find("Performance_Institution") if root.find("Performance_Institution") is not None and root.find("Performance_Institution").find("Name").text is not None else None
                
                if institution is None or root.find("Performance_Institution").find("Name").text is None:
                    institution = root.findall("Institution")[0] if len(root.findall("Institution")) > 0 else None

                inst_name = institution.find("Name").text if institution is not None and institution.find("Name") is not None else None

                zipCode = institution.find("ZipCode").text if institution is not None and institution.find("ZipCode") is not None else None
                state = institution.find("StateName").text if institution is not None and institution.find("StateName") is not None else None
                country = institution.find("CountryName").text if institution is not None and institution.find("CountryName") is not None else None
                org_abbr = root.find("Organization").find("Directorate").find("Abbreviation").text if root.find("Organization") is not None and root.find("Organization").find("Directorate") is not None and root.find("Organization").find("Directorate").find("Abbreviation") is not None else None
                org_name = root.find("Organization").find("Directorate").find("LongName").text if root.find("Organization") is not None and root.find("Organization").find("Directorate") is not None and root.find("Organization").find("Directorate").find("LongName") is not None else None

                cursor = connection.cursor()
                cursor.execute("Insert into awards (awardID, title, effectiveDate, expDate, amount, instrument, programOfficer, institution, zipCode, state, country, org_abbr, org_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            (awardid, title, effectiveDate, expDate, amount, instrument, programOfficer, inst_name, zipCode, state, country, org_abbr, org_name))


                investigators = root.findall("Investigator")
                for i in investigators:
                    cursor = connection.cursor()
                    name = i.find("PI_FULL_NAME").text if i.find("PI_FULL_NAME") is not None else None
                    if name is None:
                        first_name = i.find("FirstName").text if i.find("FirstName") is not None else ""
                        last_name = i.find("LastName").text if i.find("LastName") is not None else ""
                        if first_name is None:
                            first_name = ""
                        if last_name is None:
                            last_name = ""
                        name = first_name + " " + last_name

                    roleCode = i.find("RoleCode").text if i.find("RoleCode") is not None else None

                    cursor.execute("Insert into investigators (awardID, name, roleCode) VALUES (?, ?, ?)",
                                (awardid, name, roleCode))


                programElement = root.findall("ProgramElement")
                for i in programElement:
                    cursor = connection.cursor()
                    code = i.find("Code").text if i.find("Code") is not None else None
                    text = i.find("Text").text if i.find("Text") is not None else None
                    
                    cursor.execute("Insert into programElement (awardID, code, text) VALUES (?, ?, ?)",
                                    (awardid, code, text))
            

                programReference = root.findall("ProgramReference")
                for i in programReference:
                    cursor = connection.cursor()
                    code = i.find("Code").text if i.find("Code") != -1 else None
                    text = i.find("Text").text if i.find("Text") != -1 else None
                    
                    cursor.execute("Insert into programReference (awardID, code, text) VALUES (?, ?, ?)",
                                    (awardid, code, text))


            except ET.ParseError as e:
                print(f"Error parsing {fullname}: {e}")
            except Exception as e:
                print(f"Unexpected error processing {fullname}: {e}")

    
    #print(cursor.execute("SELECT * FROM awards LIMIT 20").fetchall()[0])
    print(connection.total_changes)




## OPTIONAL --- Converts above tables into a single new table with all the data, saves storage space

# -- CREATE TABLE allAwards AS
# -- SELECT 
# --     awards.*,
# --     GROUP_CONCAT(DISTINCT CASE 
# --         WHEN investigators.roleCode IN ('Principal Investigator', 'Former Principal Investigator') OR investigators.roleCode IS NULL 
# --         THEN investigators.name 
# --     END) AS primary_investigators,
# --     GROUP_CONCAT(DISTINCT CASE 
# --         WHEN investigators.roleCode IN ('Co-Principal Investigator', 'Former Co-Principal Investigator') 
# --         THEN investigators.name 
# --     END) AS co_primary_investigators,
# --     GROUP_CONCAT(DISTINCT programElement.code) AS programElementCodes,
# --     GROUP_CONCAT(DISTINCT programReference.code) AS programReferenceCodes
# -- FROM 
# --     awards
# -- LEFT JOIN 
# --     investigators ON awards.awardID = investigators.awardID
# -- LEFT JOIN 
# --     programElement ON awards.awardID = programElement.awardID
# -- LEFT JOIN 
# --     programReference ON awards.awardID = programReference.awardID
# -- GROUP BY 
# --     awards.awardID;

