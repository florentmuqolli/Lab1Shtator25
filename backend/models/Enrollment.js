const db = require('../config/db');

const Enrollment = {
  getAll: () => db.query('SELECT * FROM enrollments'),

  getById: (id) => db.query('SELECT * FROM enrollments WHERE id = ?', [id]),

  getByStudentId: (studentId) =>
    db.query('SELECT * FROM enrollments WHERE student_id = ?', [studentId]),

  getStudentsByClassId: (classId) => {
      return db.query(`
        SELECT s.id, s.user_id
        FROM enrollments e
        INNER JOIN students s ON e.student_id = s.id
        WHERE e.class_id = ?
      `, [classId]);
    },

    getEnrollmentsByTeacherId: (teacherId) => {
      return db.query(`
        SELECT 
          e.id AS enrollment_id,
          s.id AS student_id,
          s.user_id AS student_user_id,
          c.id AS class_id,
          c.title AS class_title
        FROM enrollments e
        INNER JOIN students s ON e.student_id = s.id
        INNER JOIN classes c ON e.class_id = c.id
        WHERE c.teacher_id = ?
      `, [teacherId]);
    },



  countStudentsByTeacherId: async (teacherId) => {
    const [[result]] = await db.execute(`
      SELECT COUNT(DISTINCT student_id) AS totalStudents
      FROM enrollments
      WHERE class_id IN (
        SELECT id FROM classes WHERE teacher_id = ?
      )
    `, [teacherId]);
    return result.totalStudents;
  },

  getByClassId: (classId) =>
    db.query('SELECT * FROM enrollments WHERE class_id = ?', [classId]),

  create: (data) =>
    db.query(
      'INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)',
      [data.student_id, data.class_id]
    ),

  delete: (id) => db.query('DELETE FROM enrollments WHERE id = ?', [id]),
};

module.exports = Enrollment;
