import { PDFDocument, PDFForm, PDFField } from 'pdf-lib';

export class FormHandler {
  async getFormFields(pdfBytes: Uint8Array) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    return fields.map(field => ({
      name: field.getName(),
      type: field.constructor.name,
      value: this.getFieldValue(field)
    }));
  }

  async fillForm(pdfBytes: Uint8Array, formData: Record<string, string>) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    for (const [fieldName, value] of Object.entries(formData)) {
      const field = form.getField(fieldName);
      if (field) {
        if (field instanceof PDFForm.PDFTextField) {
          field.setText(value);
        } else if (field instanceof PDFForm.PDFCheckBox) {
          field.check();
        }
      }
    }

    return await pdfDoc.save();
  }

  async createForm(pdfBytes: Uint8Array, fields: Array<{
    type: 'text' | 'checkbox',
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
  }>) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    fields.forEach(field => {
      if (field.type === 'text') {
        form.createTextField(field.name, {
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height
        });
      } else if (field.type === 'checkbox') {
        form.createCheckBox(field.name, {
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height
        });
      }
    });

    return await pdfDoc.save();
  }

  private getFieldValue(field: PDFField): string {
    if (field instanceof PDFForm.PDFTextField) {
      return field.getText() || '';
    } else if (field instanceof PDFForm.PDFCheckBox) {
      return field.isChecked() ? 'checked' : 'unchecked';
    }
    return '';
  }
}