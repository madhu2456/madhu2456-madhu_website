import os
import shutil
from docx2pdf import convert

def main():
    src_docx = 'scratch/Madhu Dadi_Resume_edited.docx'
    dest_docx = 'Madhu Dadi_Resume.docx'
    dest_pdf = 'Madhu Dadi_Resume.pdf'
    public_pdf = 'public/resume.pdf'
    
    # 1. Overwrite the original docx
    print(f"Copying {src_docx} to {dest_docx}...")
    shutil.copy(src_docx, dest_docx)
    
    # 2. Convert docx to pdf
    print(f"Converting {dest_docx} to {dest_pdf}...")
    # docx2pdf requires MS Word on Windows
    convert(dest_docx, dest_pdf)
    
    # 3. Copy output pdf to public/resume.pdf
    print(f"Copying {dest_pdf} to {public_pdf}...")
    shutil.copy(dest_pdf, public_pdf)
    print("Done!")

if __name__ == '__main__':
    main()
