const BASE = "http://localhost:5000/api/v1";

const users = [
  { firstName: "Ahmed", lastName: "Ali", username: "ahmed_ali", email: "ahmed@nego.com", password: "123456" },
  { firstName: "Sara",  lastName: "Omar", username: "sara_omar",  email: "sara@nego.com",  password: "123456" },
];

async function seed() {
  for (const u of users) {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u),
    });
    const data = await res.json();
    if (data.success) {
      console.log(`✅ Created: ${u.username} | token: ${data.token}`);
    } else {
      console.log(`⚠️  ${u.username}: ${data.message}`);
    }
  }
}

seed();
