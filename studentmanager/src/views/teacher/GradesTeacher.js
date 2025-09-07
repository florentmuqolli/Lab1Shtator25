import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherGrades = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, gradesRes] = await Promise.all([
        axios.get("/class/specific-class"),
        axios.get("/grades/my"),
      ]);
      setClasses(classesRes.data);
      setGrades(gradesRes.data);
      setFilteredGrades(gradesRes.data);
      toast.success('Grades data loaded successfully');
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForClass = async (classId) => {
    try {
      const res = await axios.get(`/enrollment/${classId}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredGrades(grades);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = grades.filter((grade) => {
        return (
          grade.student_id.toString().includes(lowerText) ||
          grade.class_id.toString().includes(lowerText) ||
          grade.grade.toString().includes(lowerText)
        );
      });
      setFilteredGrades(filtered);
    }
  };

  const handleAddGrade = async () => {
    if (!selectedClassId || !selectedStudentId || !gradeValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post("/grades", {
        class_id: selectedClassId,
        student_id: selectedStudentId,
        grade: parseFloat(gradeValue),
      });

      toast.success("Grade added successfully");
      setShowAddModal(false);
      setSelectedClassId("");
      setSelectedStudentId("");
      setGradeValue("");
      fetchData();
    } catch (error) {
      console.error("Error adding grade:", error);
      toast.error("Failed to add grade");
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
  };

  if (loading && grades.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading grades data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {}
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Grade Management</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fas fa-plus me-1"></i> Add Grade
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-search text-muted me-2"></i>
                  <Form.Control
                    type="text"
                    placeholder="Search by student ID, class ID, or grade..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-0"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="p-3">
                <h3 className="fw-bold text-primary mb-1">{grades.length}</h3>
                <small className="text-muted">Total Grades</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        {filteredGrades.length > 0 ? (
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="fw-bold text-dark mb-4">Grade Records</h5>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Class ID</th>
                        <th>Grade</th>
                        <th>Date Graded</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.map((grade) => (
                        <tr key={grade.id}>
                          <td className="fw-semibold">{grade.student_id}</td>
                          <td>{grade.class_id}</td>
                          <td>
                            <Badge bg={getGradeColor(grade.grade)} className="px-3 py-2">
                              {grade.grade}
                            </Badge>
                          </td>
                          <td>
                            {grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <Badge bg="success">Recorded</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <Card className="border-0 shadow-sm text-center py-5">
                <Card.Body>
                  <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark mb-2">
                    {searchQuery ? 'No matching grades found' : 'No grades recorded yet'}
                  </h5>
                  <p className="text-muted mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms' 
                      : 'Add grades using the button above to get started'}
                  </p>
                  {searchQuery ? (
                    <Button variant="outline-primary" onClick={() => handleSearch('')}>
                      Clear Search
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                      Add First Grade
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Grade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Class</Form.Label>
              <Form.Select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedStudentId("");
                  if (e.target.value) {
                    fetchStudentsForClass(e.target.value);
                  }
                }}
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} (ID: {cls.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {students.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Select Student</Form.Label>
                <Form.Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Choose a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      Student ID: {student.id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Enter Grade</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter grade (e.g., 85.50)"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
              <Form.Text className="text-muted">
                Enter a grade between 0 and 100
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddGrade}>
            Submit Grade
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherGrades;