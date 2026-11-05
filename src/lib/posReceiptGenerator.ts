export const printHtmlReceipt = (booking: any, paymentMethod: string, amountReceived: number) => {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) return;

  const htmlContent = `
    <html>
      <head>
        <title>Print Receipt</title>
        <style>
          @page { margin: 0; size: 48mm auto; }
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 48mm;
            margin: 0;
            padding: 2mm;
            color: #000;
            font-weight: 900; 
            font-size: 11px; 
            line-height: 1.3;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
          }
          .text-center { text-align: center; }
          .font-bold { font-weight: 900; }
          .title { font-size: 18px; letter-spacing: 1px; margin-bottom: 2px; }
          .subtitle { font-size: 8px; margin-top: 0; letter-spacing: 2px; text-transform: uppercase; font-weight: 900; } 
          .divider { border-top: 1.5px dashed #000; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
          .col { display: flex; flex-direction: column; margin-bottom: 4px; }
          .table-header { border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; padding: 4px 0; font-weight: 900; }
          .mt-4 { margin-top: 10px; }
          
          .flagship-container {
            width: 100%;
            text-align: center;
            margin: 6px 0;
          }
          .flagship-line {
            border-top: 2px solid #000;
            width: 100%;
            margin: 2px 0;
          }
          .flagship-text {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 3px;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="text-center" style="margin-bottom: 5px;">
          <div class="title">STUDIO SPACE</div>
          <div class="subtitle">Premium Studio</div>
        </div>

        <div class="divider"></div>

        <div class="row">
          <span>Receipt:</span>
          <span>#${booking._id.slice(-6).toUpperCase()}</span>
        </div>
        <div class="row">
          <span>Date:</span>
          <span>${booking.date}</span>
        </div>
        
        <div class="text-center" style="margin: 8px 0;">
          <div style="font-size: 9px; margin-bottom: 2px;">Customer</div>
          <div style="word-wrap: break-word; white-space: normal;">${booking.userName}</div>
        </div>
        
        <div class="row">
          <span>Studio:</span>
          <span style="max-width: 22mm; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${booking.studioTitle}</span>
        </div>
        
        ${booking.isFlagship ? `
        <div class="flagship-container">
          <div class="flagship-line"></div>
          <div class="flagship-text">FLAGSHIP</div>
          <div class="flagship-line"></div>
        </div>
        ` : ''}

        <div class="divider"></div>

        <div class="row table-header">
          <span>Desc</span>
          <span>Amount</span>
        </div>
        <div class="row mt-4">
          <span>Studio Rental</span>
          <span>$${Number(booking.totalPrice).toFixed(2)}</span>
        </div>

        <div class="divider"></div>

        <div class="row" style="font-size: 14px;">
          <span>TOTAL:</span>
          <span>$${Number(booking.totalPrice).toFixed(2)}</span>
        </div>
        <div class="row mt-4">
          <span>Paid:</span>
          <span>${paymentMethod.toUpperCase()}</span>
        </div>
        <div class="row">
          <span>Amount Recv:</span>
          <span>$${Number(amountReceived).toFixed(2)}</span>
        </div>

        <div class="divider"></div>

        <div class="text-center mt-4" style="font-style: italic;">
          <p style="margin: 0;">Thank you for choosing us!</p>
          <p style="margin: 3px 0;">www.studiospace.com</p>
        </div>

        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 500); 
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};