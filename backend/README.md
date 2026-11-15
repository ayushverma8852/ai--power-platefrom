# InterviewPrep AI — Spring Boot Backend

College Minor Project: **AI-Powered Interview Preparation System (InterviewPrep AI)**

Enterprise-grade, modular backend built with **Java 21**, **Spring Boot 3.4.0**, and **Maven**.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Java**: Java 21 LTS installed (`java -version`)
- **Maven**: Bundled Maven wrapper (`mvnw.cmd` / `mvnw`) is included, no global Maven installation required.

### 2. Run the Application in Development Mode
Open your terminal inside the `backend/` directory:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
*(On macOS / Linux / Git Bash: `./mvnw spring-boot:run`)*

The server will start on port **`8080`**:
👉 **`http://localhost:8080`**

### 3. Alternative: Run the Pre-compiled Executable JAR
```bash
cd backend
java -jar target/interviewprep-backend-0.0.1-SNAPSHOT.jar
```

---

## 🔍 Health Check API

Verify that the backend is running by accessing:
```http
GET http://localhost:8080/api/health
```

### Sample Response (`HTTP 200 OK`):
```json
{
  "status": "UP",
  "message": "InterviewPrep AI Backend is running smoothly.",
  "service": "interviewprep-backend",
  "version": "1.0.0",
  "timestamp": "2026-11-14T21:13:11.627023400Z"
}
```

---

## 📁 Package Architecture

```
backend/
├── pom.xml                                  # Maven dependencies (Java 21, Spring Boot 3.4.0)
├── mvnw / mvnw.cmd                          # Portable Maven wrapper scripts
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── interviewprep/
        │           ├── InterviewPrepApplication.java  # Main Application Entry Point
        │           ├── config/              # Web & CORS configuration (allows Vite port 5173)
        │           │   └── WebCorsConfig.java
        │           ├── controller/          # REST Controllers
        │           │   └── HealthController.java
        │           ├── dto/                 # Data Transfer Objects
        │           │   └── HealthResponse.java
        │           ├── service/             # Business Logic interfaces & implementations
        │           ├── repository/          # Spring Data JPA repositories
        │           ├── entity/              # JPA database domain entities
        │           └── exception/           # Global exception handling
        │               └── GlobalExceptionHandler.java
        └── resources/
            └── application.properties       # Server configuration (Port 8080, logging)
```

---

## 🌐 Cross-Origin Resource Sharing (CORS)

Configured in `com.interviewprep.config.WebCorsConfig` to allow cross-origin requests from the React frontend running on:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

---

## 📌 Phase 1 Milestone Status
- [x] Java 21 LTS verified and configured.
- [x] Clean folder architecture (`config`, `controller`, `dto`, `service`, `repository`, `entity`, `exception`).
- [x] Spring Web, Validation, Spring Data JPA, and MySQL Driver declared in `pom.xml`.
- [x] Initial `GET /api/health` REST endpoint operational.
- [x] Decoupled from active MySQL database connection for zero-dependency Phase 1 startup.
