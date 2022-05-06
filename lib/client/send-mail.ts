import { gmail_v1 } from "googleapis";

const sendMail = async data => {
  const response = await fetch("/api/mail/send", {
      method: "POST",
      body: JSON.stringify(data),
  })

  const json = await response.json()
  
  if (response.ok) {
    return json as gmail_v1.Schema$Message
  }

  throw new Error(json.error.errors[0].message)
}

export default sendMail