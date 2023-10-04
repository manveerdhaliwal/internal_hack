const userName = document.getElementById("name");
    const societyName = document.getElementById("society");
    const eventName = document.getElementById("event");
    const submitBtn = document.getElementById("submitBtn");
    //  const dateValue = document.getElementById("date").value;
    
    const { PDFDocument, rgb } = PDFLib;
    
    //const mess = `For having participated in ${eventName} organised by ${societyName}`
    //const message = `For having participated in ${eventName} organised by ${societyName}`
    submitBtn.addEventListener("click", () => {
      const userNameValue = userName.value;
      const societyNameValue = societyName.value;
      const eventNameValue = eventName.value;
      const dateValue = document.getElementById("date").value; 

      if (userNameValue.trim() !== "" && userName.checkValidity()) {
        const message = `For having participated in ${eventNameValue} organised by ${societyNameValue}`;
        console.log(message);
        console.log(dateValue)
        generatePDF(userNameValue, message,dateValue);
      } else {
        userName.reportValidity();
      }
    });

    const generatePDF = async (userName, message, date) => {
      const existingPdfBytes = await fetch("./cert.pdf").then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      const textHeight = 62;
      const pageWidth = firstPage.getWidth();

      const estimateTextWidth = (text, fontSize) => text.length * (fontSize / 2);

      // Calculate the X positions to center the text
      const userNameWidth = estimateTextWidth(userName, textHeight);
      const messageWidth = estimateTextWidth(message, 18);
    
      const userNameX = (pageWidth - userNameWidth) / 2;
      const messageX = (pageWidth - messageWidth) / 2;
    
      const startY = 279;
      const messageY = 220;
      firstPage.drawText(userName, {
        x: userNameX-5,
        y: startY,
        size: textHeight,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(message, {
        x: messageX+10,
        y: messageY,
        size: 18,
        color: rgb(0, 0, 0),
      });
      
      firstPage.drawText(date, {
        x: 200,
        y: 150 ,
        size: 20,
        color: rgb(0, 0, 0),
      });
      
      const pdfBytes = await pdfDoc.save();
      const file = new File([pdfBytes], "Certificate.pdf", {
        type: "application/pdf;charset=utf-8",
      });
      saveAs(file);
    };