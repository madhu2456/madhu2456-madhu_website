import zipfile
import shutil
import xml.etree.ElementTree as ET
import os

def edit_docx(src_path, dest_path):
    temp_dir = 'scratch/docx_temp'
    os.makedirs(temp_dir, exist_ok=True)
    
    # 1. Extract the document
    with zipfile.ZipFile(src_path, 'r') as docx:
        docx.extractall(temp_dir)
        
    # 2. Read and parse word/document.xml
    doc_xml_path = os.path.join(temp_dir, 'word/document.xml')
    tree = ET.parse(doc_xml_path)
    root = tree.getroot()
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    paragraphs = root.findall('.//w:p', ns)
    
    # Modify Paragraph 42 (Udemy Enroller metadata)
    p42 = paragraphs[42]
    runs_42 = p42.findall('.//w:r', ns)
    # Check if this matches our expected runs
    p42_texts = [r.find('.//w:t', ns).text for r in runs_42 if r.find('.//w:t', ns) is not None]
    print(f"P42 before edit: {p42_texts}")
    
    if len(runs_42) >= 5:
        # Run 0: 'Udemy Enroller' -> 'Browser Task Automation'
        t0 = runs_42[0].find('.//w:t', ns)
        if t0 is not None:
            t0.text = 'Browser Task Automation'
        # Run 1: ' | Automation Platform' -> ' | Workflow Platform'
        t1 = runs_42[1].find('.//w:t', ns)
        if t1 is not None:
            t1.text = ' | Workflow Platform'
        # Run 2: ' | January 2026 - Present' -> ' | January 2026 - Present'
        # Run 3: ' | ' -> ''
        t3 = runs_42[3].find('.//w:t', ns)
        if t3 is not None:
            t3.text = ''
        # Run 4: 'udemyenroller.madhudadi.in' -> ''
        t4 = runs_42[4].find('.//w:t', ns)
        if t4 is not None:
            t4.text = ''

    # Modify Paragraph 43
    p43 = paragraphs[43]
    runs_43 = p43.findall('.//w:r', ns)
    if runs_43 and len(runs_43) > 0:
        t0_43 = runs_43[0].find('.//w:t', ns)
        if t0_43 is not None:
            t0_43.text = 'Developed a workflow automation platform that executed 20,000+ automated browser tasks within 6 months, reducing manual effort by 90%.'

    # Modify Paragraph 44
    p44 = paragraphs[44]
    runs_44 = p44.findall('.//w:r', ns)
    if runs_44 and len(runs_44) > 0:
        t0_44 = runs_44[0].find('.//w:t', ns)
        if t0_44 is not None:
            t0_44.text = 'Engineered a FastAPI + Celery backend with Redis to orchestrate headless browser workers and limit active concurrency.'

    # Modify Paragraph 45
    p45 = paragraphs[45]
    runs_45 = p45.findall('.//w:r', ns)
    if runs_45 and len(runs_45) > 0:
        t0_45 = runs_45[0].find('.//w:t', ns)
        if t0_45 is not None:
            t0_45.text = 'Implemented secure session-state management and encrypted storage for user-authorized session artifacts, ensuring compliance and reliability.'

    # Save word/document.xml
    # Register namespaces to preserve prefix mapping w:
    ET.register_namespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    # Add other namespaces if they are present in the root attribute
    for prefix, uri in root.attrib.items():
        if prefix.startswith('xmlns:'):
            p = prefix.split(':')[1]
            ET.register_namespace(p, uri)
            
    tree.write(doc_xml_path, encoding='utf-8', xml_declaration=True)
    
    # 3. Zip back into dest_path
    if os.path.exists(dest_path):
        os.remove(dest_path)
        
    shutil.make_archive(dest_path.replace('.docx', ''), 'zip', temp_dir)
    shutil.move(dest_path.replace('.docx', '') + '.zip', dest_path)
    
    # Cleanup temp
    shutil.rmtree(temp_dir)
    print(f"Successfully edited and wrote to {dest_path}")

if __name__ == '__main__':
    # Let's write to a temp file first to verify
    edit_docx('Madhu Dadi_Resume.docx', 'scratch/Madhu Dadi_Resume_edited.docx')
