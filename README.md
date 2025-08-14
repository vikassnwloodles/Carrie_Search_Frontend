# Ask Pete Frontend

This repository contains the frontend for **Ask Pete** formerly known as **Carrie Search**.

## Setup Frontend

Follow these steps to set up the frontend locally:

1. **Clone the repository**
```bash
git clone https://github.com/vikassnwloodles/Carrie_Search_Frontend.git
cd Carrie_Search_Frontend/
````

2. **Create the configuration file**

```bash
echo 'window.env = {
  BASE_URL: "http://localhost:8000",
  FRONTEND_BASE_URL: "http://127.0.0.1:5500"
};' > assets/js/config.js
```

3. **If using VS Code**

* Open the project in VS Code:

```bash
code .
```

* Install the **Live Server** extension by Ritwick Dey.
* Click on **"Go Live"** in the bottom right corner of VS Code to start the frontend server.

---

## Notes

* Ensure that the **backend is running** at `http://localhost:8000` for proper functionality.
* The `config.js` file defines the base URLs for API and frontend.
* You can access the frontend locally via the Live Server URL (usually `http://127.0.0.1:5500`).
