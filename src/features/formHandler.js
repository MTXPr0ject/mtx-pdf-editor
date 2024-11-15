import { PDFDocument } from 'pdf-lib';

export class FormHandler {
  async getFormFields(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    return fields.map(field => ({
      name: field.getName(),
      type: field.constructor.name,
      value: this.getFieldValue(field)
    }));
  }

  async fillForm(pdfBytes, formData) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    for (const [fieldName, value] of Object.entries(formData)) {
      const field = form.getField(fieldName);
      if (field) {
        if (field instanceof PDFDocument.PDFTextField) {
          field.setText(value);
        } else if (field instanceof PDFDocument.PDFCheckBox) {
          field.check();
        }
      }
    }

    return await pdfDoc.save();
  }

  getFieldValue(field) {
    if (field instanceof PDFDocument.PDFTextField) {
      return field.getText() || '';
    } else if (field instanceof PDFDocument.PDFCheckBox) {
      return field.isChecked() ? 'checked' : 'unchecked';
    }
    return '';
  }
}