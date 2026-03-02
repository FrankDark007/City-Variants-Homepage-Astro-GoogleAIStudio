import https from 'https';

async function main() {
  const pages = [
    'USAA',
    'State_Farm',
    'Allstate',
    'Travelers_(company)',
    'Chubb_Limited',
    'American_International_Group'
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`https://en.wikipedia.org/wiki/${page}`);
      const html = await res.text();
      const match = html.match(/<img[^>]+src="([^"]+)"/g);
      if (match) {
        for (const m of match) {
          if (m.toLowerCase().includes('logo') && !m.includes('mw-logo')) {
             console.log(`${page}: ${m}`);
             break;
          }
        }
      }
    } catch (e) {
      console.log(`${page}: Error`);
    }
  }
}

main();
