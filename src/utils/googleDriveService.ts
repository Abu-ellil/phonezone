import { google } from "googleapis";
import { Readable } from "stream";

// تكوين Google Drive API
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const credentials = {
  type: "service_account",
  project_id: "fone-zone-454303",
  private_key_id: "60c373a4eb327b0d81e5339d1141b6d97643ade9",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDHDezjgrrmE6V/\no3ltYq6ZnYflDx7uOmamu7oboT4Z9UDCrPB/p53KQ8veIO8cYfoOL8gsA1bAu43q\nsqBdSc41I2Ykz0N6hyZXyj+ReAKMscBAAxg9YBPQ3dQ3XaRdi2BadMw1WoadfB7g\nkZRPkFifXMZ+VM8+78E3c6F0I9oiL/N5WJbcD8B8DFT45rC3q3cJIKJWesPX2vbx\nK5BEYFEzxHq/NrMHOPov3UYRPFFKcjGcrmwyvd+AlWm5GdyqVfkwDLVkvwZ/3RSV\n7y+jLolv72neytukJbp6wJ4XT3MoKSYFf14ESdrLJrZ6M3GfbnjQwggba2Fz4heW\nj96EFzR5AgMBAAECggEAAN9I6kb13lvire2qSAuWe+9/8MXWsFuK0fCLpGMEpyTM\nd63opd6MUfO8bnOS01CDQdGoHQ1CBuPWKjDwg/LMAllD3CXDrsNDLJT4dKuOc020\nwR23sE5997x+brmse95y+c0o4ej3eF7ascg22qcQGa6p41QoI6dK9PJpmDKEr6v9\nIdDwZmbPARy7u5VYJ+1DWXLxmaj7VXTN9e81nelesgw1eDOnsOyFhpYfR06h8Eio\nKzwoiiD4/tqPJkH04UNGtkTd4NurVcK7691PIPUOSnrUd2F1VgrzgTOSg3d3KdiH\nNPc5+gqc3EWGCCPljlxQWQdIv4v4XIJPeXipx/TRCwKBgQD1BMwP/eiWQQpe7ZHs\n1zD4VWYyOOPPlZ4L3mFkVZbWHON09faTYtGFQO+ZidOQDYAXvoq110/RKlWl2wdz\nWae/fOprHmnwqlbtsUocaRLfAAB17Pmsu6mx/HdFl7hudTlY+fJ59J3sBQibuZKk\nQQi8OvTZIwY2bDNpbxb9p16GfwKBgQDP+cKQqtstRcph7T/mQPpSrrZh6HlkfYu9\nGSzuKjrmI5foJnJKNrZliJMpZcLfBzlP5d75HB/xEr7x8P7TNE/AkXwyc08eXY9Z\nnnWJQfd9FtPPpwA835xhgQp0P2xCrPirLL4fGuJATD0JEwEN612HFsxXrs2NQjev\nF3OaCFD5BwKBgHPwUCslB4DJyAGBQvKiJO7tYg1TtCCO+Jk/IjCa+2PXiZ3XoVS+\nhswaHQY3HJ/mc31I0VQYTRF5icuQZ+ciPmkyz63eV1zlDXst0Ba/dYmF87HZb49X\nwYWSJFIO59uEpp0+sIkawftjql4dopEMoPiIoUF5/D+WVYGHaoaeQvE7AoGAIb77\nDRJMIhpy7lTay3e7pnLm8RgRqnacmABfw/1iNTmNSoQCg3xBOFRi3JLAfgPkDszT\n00P3Atzx0rwx/P89+ZchueXv7pNr0TTfCXiEue1cTRNh/H6kF0Yi9h3caS075DqM\nVuu7zocQWEqXHzUTpfnTCl84xzT5aBW8EkBLMz0CgYAdOq/b1Mb49/rgslpaegDM\ntHsPsfo+0Xh73jGCiTEMYDBJrfOjDgEALy2gJCVCDksN+y2XPhyqpcUYAc/4pV3F\nMqM6vxyvVbbs9q1JLGusGjsyh2KoIyI7Y2B/fHhc2j/BZiWFTEJSM6+hU7f0VzOs\nqGaLgzzjPB03+72gaTIPvQ==\n-----END PRIVATE KEY-----\n",
  client_email: "fone-zone@fone-zone-454303.iam.gserviceaccount.com",
  client_id: "104570475106272478636",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/fone-zone%40fone-zone-454303.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export async function uploadPDFToGoogleDrive(
  pdfBytes: Uint8Array,
  orderNumber?: string,
  customerName?: string,
  documentType: string = "order"
): Promise<string> {
  try {
    // إنشاء اسم ملف فريد
    const timestamp = new Date().getTime();
    const sanitizedName = customerName
      ? customerName.replace(/[^a-zA-Z0-9]/g, "_")
      : "unknown";

    let filename;
    if (customerName && orderNumber) {
      filename = `${documentType}-${sanitizedName}-${orderNumber}-${timestamp}.pdf`;
    } else if (orderNumber) {
      filename = `${documentType}-${orderNumber}-${timestamp}.pdf`;
    } else if (customerName) {
      filename = `${documentType}-${sanitizedName}-${timestamp}.pdf`;
    } else {
      filename = `${documentType}-${timestamp}.pdf`;
    }

    console.log(`Preparing to upload PDF to Google Drive: ${filename}`);

    // إنشاء stream من البيانات
    const fileStream = new Readable();
    fileStream.push(Buffer.from(pdfBytes));
    fileStream.push(null);

    // تحميل الملف إلى Google Drive
    const fileMetadata = {
      name: filename,
      mimeType: "application/pdf",
    };

    const media = {
      mimeType: "application/pdf",
      body: fileStream,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    if (!file.data.id) {
      throw new Error("Failed to get file ID from Google Drive");
    }

    // تعيين إذن الوصول العام للملف
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // الحصول على رابط المشاركة العام
    const publicUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
    console.log(`PDF uploaded successfully to Google Drive, URL: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading PDF to Google Drive:", error);
    throw error;
  }
}
