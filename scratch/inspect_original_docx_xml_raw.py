import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('Madhu Dadi_Resume.docx', 'r') as docx:
    xml_content = docx.read('word/document.xml')
    # Let's inspect the original w:p tags
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = root.findall('.//w:p', ns)
    
    for idx in [42, 43, 44, 45]:
        p_xml = ET.tostring(paragraphs[idx], encoding='utf-8').decode('utf-8')
        print(f"Paragraph [{idx}] raw xml:")
        print(f"  {p_xml}\n")
