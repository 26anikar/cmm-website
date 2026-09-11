// Keep the editable payment details as text and also position them on the examples.
export function addPaymentDiagrams($) {
  const examples=[];
  $('figure').each((index, element) => {
    const figure=$(element), details=figure.next('.check-details');
    if (!details.length) return;
    const type=index===0?'check':'envelope';
    const fields=type==='check'?['payee','memo']:['sender','recipient'];
    const canvas=$('<div class="payment-diagram-canvas"></div>');
    figure.find('img').attr('alt',type==='check'?'Example showing the payee and memo fields on a check':'Example showing the return and mailing addresses on an envelope').appendTo(canvas);
    details.children('dd').each((i,field)=>{
      const label=$('<div aria-hidden="true"></div>').addClass(`diagram-label diagram-${fields[i]}`);
      if(type==='envelope'&&i===1)label.html($(field).html());
      else label.text($(field).text().replace(/\s+/g,' ').trim());
      label.appendTo(canvas);
    });
    figure.addClass(`payment-diagram ${type}-diagram`).append(canvas);
    const caption=$('<figcaption></figcaption>').text(type==='check'?'Example check — enter your date, payment amount, and signature in the remaining fields.':'Example envelope — use your own name and return address.');
    figure.append(caption);
    figure.wrap('<section class="payment-example"></section>');
    const section=figure.parent();
    section.prepend($('<h3></h3>').text(type==='check'?'1. Write your check':'2. Address your envelope'));
    details.appendTo(section);
    examples.push(section);
  });
  if (examples.length) {
    const group=$('<div class="payment-examples"></div>');
    examples[0].before(group);
    examples.forEach(section=>section.appendTo(group));
  }
}
