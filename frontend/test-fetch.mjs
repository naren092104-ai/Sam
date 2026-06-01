setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:8080/admin/users');
    const text = await r.text();
    const match = text.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    if (match) {
      const decoded = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
      console.log('=== ERROR ===');
      console.log(decoded);
    } else {
      console.log('=== FULL PAGE (no pre tag) ===');
      console.log(text.slice(0, 3000));
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}, 3000);
