import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateCertificatePdf(participant:any, event:any):Promise<string> {
    const doc = new PDFDocument({
        layout: "landscape",
        size:"A4",
    });

    //save path for generated file
    const outputPath = path.join(
        __dirname,
        `../../certificates/${participant.name.replace(/\s+/g, "_")}_${event.title}.pdf`
    );
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    //certificate design
    doc.rect(0,0, doc.page.width, doc.page.height).fill("#fdf6e3") //background

    //title
    doc
    .fontSize(30)
    .fillColor("#3333")
    .text("Certificate of Participation", {align:'center', underline: true});

    //body text
    doc.moveDown(2);
    doc.fontSize(18).text(`This is to certify that`, {align: "center"});
    doc.moveDown(1);
    doc.fontSize(25).fillColor("#00000").text(`${participant.name}`, {align:"center"}).font('Helvetica-Bold')
    doc.moveDown(1);
    doc.fontSize(18).fillColor("#33333").text(`has successfully participated in the event "${event.title}" held on ${event.date}`, {
        align:'center', width: 700
    });

    //footer 
    doc.moveDown(4);
    doc.fontSize(14).text(`Issued by: ${event.organizer}`, {align:'center' });


    doc.end()

    //wait for the stream to finish writing
        return new Promise((resolve, reject) => {
            stream.on('Finish', () => resolve(outputPath));
            stream.on('error', reject);
        });

};