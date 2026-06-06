import zipfile

with zipfile.ZipFile('Madhu Dadi_Resume.docx', 'r') as docx:
    xml_content = docx.read('word/document.xml').decode('utf-8')
    
    # Let's search for Udemy and CAPTCHA
    for term in ['Udemy Enroller', 'CAPTCHA', 'free courses', 'asynchronous task queues', 'custom scrapers']:
        idx = xml_content.find(term)
        if idx != -1:
            print(f"Found '{term}' at index {idx}:")
            print(f"  Snippet: {xml_content[idx-50:idx+150]}")
        else:
            print(f"Not found: '{term}'")
