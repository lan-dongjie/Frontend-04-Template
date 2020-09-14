function UTF8Encoding(str) {
  if (!str) {
    return
  }
   
  const buf = Buffer.from(str)
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    
    console.log(b.toString(2), b);
  }
}
UTF8Encoding('一')