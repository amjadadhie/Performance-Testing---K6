# Performance Testing - K6

This repository is used to perform **load testing and stress testing** using [k6](https://k6.io) to evaluate the backend and frontend performance of a web-based VoIP broadcasting system.

It is part of a larger project that includes a real-time communication system using Asterisk and a custom-built frontend interface.

- 🔗 [Frontend Repository (Website)](https://github.com/RakaAdmiharfan/fe-voip-atc)  
- 🔗 [Asterisk VoIP Server Repository](https://github.com/amjadadhie/Asterisk)  
- 📄 [Project Documentation (Medium)](https://medium.com/@prasetyoamjad/build-a-web-based-voip-broadcasting-communication-system-with-push-to-talk-campus-final-project-52ec724f57bd)

---

## 🎯 Purpose

This project evaluates:

- API performance (e.g., login, fetch contacts, initiate call).
- System stability under concurrent users.
- Maximum user load before degradation or failure.
- Response time and throughput for critical VoIP actions.

---

## ⚙️ Tools

- **[k6](https://k6.io)** – Modern load testing tool built for developers.
- JavaScript – k6 test scripts are written using JS syntax.
- CLI or CI-based testing workflows.

---

## 🚀 How to Run

1. **Install k6 (if not installed):**

```bash
# macOS (Homebrew)
brew install k6

# Debian/Ubuntu
sudo apt install k6
