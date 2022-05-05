const sendMail = async data => {
  const res = await fetch("/api/mail/send", {
      method: "POST",
      body: JSON.stringify(data),
  }).then((res) => res.json());

  return res
}

export default sendMail