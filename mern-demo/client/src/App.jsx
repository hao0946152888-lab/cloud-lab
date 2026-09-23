import { useEffect, useState } from "react";

function App() {
  // ==============================
  // DANH SÁCH SINH VIÊN
  // ==============================
  const [students, setStudents] = useState([]);

  // ==============================
  // DỮ LIỆU FORM
  // ==============================
  const [mssv, setMssv] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ==============================
  // THÔNG BÁO
  // ==============================
  const [message, setMessage] = useState("");

  // ==============================
  // CÂU 47
  // GET /api/students
  // ==============================
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage("Không thể kết nối đến Backend");
    }
  };

  // Khi mở trang thì lấy danh sách sinh viên
  useEffect(() => {
    fetchStudents();
  }, []);

  const resetForm = () => {
    setMssv("");
    setHoTen("");
    setEmail("");
    setEditingId(null);
  };

  // ==============================
  // CÂU 49
  // POST /api/students
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!mssv || !hoTen || !email) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/students/${editingId}` : "/api/students";

      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: mssv,
          name: hoTen,
          email: email,
        }),
      });

      const data = await response.json();

      // Nếu Backend trả về lỗi
      if (!response.ok) {
        throw new Error(
          data.message || "Thêm sinh viên thất bại"
        );
      }

      // Thông báo thành công
      setMessage(editingId ? "Cập nhật sinh viên thành công!" : "Thêm sinh viên thành công!");

      // Xóa dữ liệu trong Form
      resetForm();

      // Gọi lại API GET để cập nhật danh sách
      fetchStudents();

    } catch (error) {
      console.error("Lỗi:", error);

      setMessage("Lỗi: " + error.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setMssv(student.studentId);
    setHoTen(student.name);
    setEmail(student.email);
    setMessage("Đang chỉnh sửa sinh viên");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xóa sinh viên thất bại");
      }

      setMessage("Xóa sinh viên thành công!");
      fetchStudents();
    } catch (error) {
      setMessage("Lỗi: " + error.message);
    }
  };

  return (
    <div
      style={{
        width: "800px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ==============================
          TIÊU ĐỀ
      ============================== */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Danh sách sinh viên
      </h1>

      {/* ==============================
          FORM THÊM SINH VIÊN
      ============================== */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

        <form onSubmit={handleSubmit}>

          {/* MSSV */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>MSSV</strong>
            </label>

            <input
              type="text"
              placeholder="Nhập MSSV"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* HỌ TÊN */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Họ tên</strong>
            </label>

            <input
              type="text"
              placeholder="Nhập họ tên"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Email</strong>
            </label>

            <input
              type="email"
              placeholder="Nhập Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* NÚT THÊM */}
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Hủy
            </button>
          )}
        </form>

        {/* THÔNG BÁO */}
        {message && (
          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* ==============================
          DANH SÁCH SINH VIÊN
      ============================== */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(student)}>Sửa</button>
                  <button type="button" onClick={() => handleDelete(student._id)} style={{ marginLeft: "8px" }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;