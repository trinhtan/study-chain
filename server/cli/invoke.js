'use strict';

const argv = require('yargs').argv;
const path = require('path');
const conn = require('../fabric/network');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const uuidv4 = require('uuid/v4');

/**
 * Invoke function of chaincode
 * @param  {String} orgMSP  Org Name (default: student)
 * @param  {String} func  Function Name (required)
 * @param  {String} username User Name (required)
 */

async function main() {
  try {
    if (!argv.func || !argv.username) {
      console.log(`Parameter func or userid cannot undefined`);
      return;
    }

    let functionName = argv.func.toString();
    let username = argv.username.toString();

    await User.findOne({ username: username }, async (err, user) => {
      if (err) throw next(err);
      if (user) {
        const networkObj = await conn.connectToNetwork(user, true);
        if (functionName === 'CreateSubject' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Subject
           * @param  {String} subjectCode Subject Code (required)
           * @param  {String} subjectName Subject Name (required)
           * @param  {String} shortDescription Subject Short Description (required)
           * @param  {String} description Subject Full Description (required)
           */

          let subjectId = uuidv4();
          let subjectCode = argv.subjectCode.toString();
          let subjectName = argv.subjectName.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();

          let subject = {
            subjectId: subjectId,
            subjectCode: subjectCode,
            subjectName: subjectName,
            shortDescription: shortDescription,
            description: description
          };

          await conn.createSubject(networkObj, subject);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'CreateCourse' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Course
           * @param  {String} courseCode course Code (required)
           * @param  {String} courseName course Name (required)
           * @param  {String} shortDescription course short description (required)
           * @param  {String} description course description (required)
           */
          let courseId = uuidv4();
          let courseCode = argv.courseCode.toString();
          let courseName = argv.courseName.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();

          let course = {
            courseId: courseId,
            courseCode: courseCode,
            courseName: courseName,
            shortDescription: shortDescription,
            description: description
          };

          await conn.createCourse(networkObj, course);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'UpdateCourseInfo' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Update Course Info
           * @param  {String} courseId course id (required)
           * @param  {String} courseCode course Code (required)
           * @param  {String} courseName course Name (required)
           * @param  {String} shortDescription course short description (required)
           * @param  {String} description course description (required)
           */
          let courseId = argv.courseId.toString();
          let courseCode = argv.courseCode.toString();
          let courseName = argv.courseName.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();

          let course = {
            courseId: courseId,
            courseCode: courseCode,
            courseName: courseName,
            shortDescription: shortDescription,
            description: description
          };

          await conn.updateCourseInfo(networkObj, course);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'DeleteCourse' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Delete Course
           * @param  {String} courseId course Id (required)
           */

          let courseId = argv.courseId.toString();
          await conn.deleteCourse(networkObj, courseId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (
          functionName === 'UpdateUserInfo' &&
          (user.role === USER_ROLES.STUDENT || user.role === USER_ROLES.TEACHER)
        ) {
          /**
           * Update User Info
           */
          let fullName = argv.fullName ? argv.fullName.toString() : '';
          let phoneNumber = argv.phoneNumber ? argv.phoneNumber.toString() : '';
          let email = argv.email ? argv.email.toString() : '';
          let address = argv.email ? argv.address.toString() : '';
          let sex = argv.sex ? argv.email.toString() : '';
          let birthday = argv.birthday ? argv.birthday.toString() : '';

          let updatedUser = {
            username: user.username,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
            sex: sex,
            birthday: birthday
          };

          await conn.updateUserInfo(networkObj, updatedUser);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'UpdateSubjectInfo' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Update Subject Info
           * @param  {String} subjectId subject Id (required)
           * @param  {String} subjectCode subject Code (required)
           * @param  {String} subjectName subject Name (required)
           * @param  {String} shortDescription subject short description (required)
           * @param  {String} description course description (required)
           */

          let subjectId = argv.subjectId.toString();
          let subjectCode = argv.subjectCode.toString();
          let subjectName = argv.subjectName.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();

          let subject = {
            subjectId: subjectId,
            subjectCode: subjectCode,
            subjectName: subjectName,
            shortDescription: shortDescription,
            description: description
          };

          await conn.updateSubjectInfo(networkObj, subject);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (
          functionName === 'AddSubjectToCourse' &&
          user.role === USER_ROLES.ADMIN_ACADEMY
        ) {
          /**
           * Add Subject To Course
           * @param  {String} courseId course Id (required)
           * @param  {String} subjectId subject Id (required)
           */

          let courseId = argv.courseId.toString();
          let subjectId = argv.subjectId.toString();

          await conn.addSubjectToCourse(networkObj, courseId, subjectId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (
          functionName === 'RemoveSubjectFromCourse' &&
          user.role === USER_ROLES.ADMIN_ACADEMY
        ) {
          /**
           * Remove Subject From Course
           * @param  {String} courseId course Id (required)
           * @param  {String} subjectId subject Id (required)
           */

          let courseId = argv.courseId.toString();
          let subjectId = argv.subjectId.toString();

          await conn.removeSubjectFromCourse(networkObj, courseId, subjectId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'DeleteSubject' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Delete Subject
           * @param  {String} subjectId subject Id (required)
           */

          let subjectId = argv.subjectId.toString();

          await conn.deleteSubject(networkObj, subjectId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (
          functionName === 'CloseRegisterClass' &&
          user.role === USER_ROLES.ADMIN_ACADEMY
        ) {
          /**
           * Close Register
           * @param  {String} classId class Id (required)
           */

          let classId = argv.classId.toString();
          await conn.closeRegisterClass(networkObj, classId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'CreateCertificate' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Certificate
           * @param  {String} subjectid Subject Id (required)
           * @param  {String} student Student Username (required)
           */
          let Student = argv.student.toString();
          let SubjectID = argv.subjectid.toString();
          var issueDate = new Date().toString();
          let certificate = {
            certificateID: uuidv4(),
            subjectID: SubjectID,
            studentUsername: Student,
            issueDate: issueDate
          };
          await conn.createCertificate(networkObj, certificate);
          console.log('Transaction has been submitted 1');

          process.exit(0);
        } else if (
          functionName === 'TeacherRegisterSubject' &&
          user.role === USER_ROLES.ADMIN_ACADEMY
        ) {
          let SubjectID = argv.subjectid.toString();
          let Teacher = argv.teacher.toString();

          await conn.registerTeacherForSubject(networkObj, SubjectID, Teacher);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'StudentRegisterSubject' && user.role === USER_ROLES.STUDENT) {
          let SubjectID = argv.subjectid.toString();
          let Student = user.username;

          await conn.registerStudentForSubject(networkObj, SubjectID, Student);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'CreateScore' && user.role === USER_ROLES.TEACHER) {
          /**
           * Create Score
           * @param  {String} subjectid Subject Id (required)
           * @param  {String} student Student Username (required)
           * @param  {String} score Point of Subject (required)
           *
           */
          let SubjectID = argv.subjectid.toString();
          let Student = argv.student.toString();
          let ScoreValue = argv.score.toString();

          let score = { subjectID: SubjectID, studentUsername: Student, scoreValue: ScoreValue };
          await conn.createScore(networkObj, score);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'CreateClass' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Score
           * @param  {String} classCode
           * @param  {String} room
           * @param  {String} time
           * @param  {String} startDate
           * @param  {String} endDate
           * @param  {String} repeat
           * @param  {String} shortDescription
           * @param  {String} description
           * @param  {String} capacity
           *
           */
          let classCode = argv.classCode.toString();
          let room = argv.room.toString();
          let time = argv.time.toString();
          let startDate = argv.startDate.toString();
          let endDate = argv.endDate.toString();
          let repeat = argv.repeat.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();
          let subjectId = argv.subjectId.toString();
          let capacity = argv.capacity.toString();

          let _class = {
            classId: uuidv4(),
            classCode,
            room,
            time,
            startDate,
            endDate,
            repeat,
            shortDescription,
            description,
            subjectId,
            capacity
          };

          await conn.createClass(networkObj, _class);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (functionName === 'UpdateClassInfo' && user.role === USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Score
           * @param  {String} classId
           * @param  {String} classCode
           * @param  {String} room
           * @param  {String} time
           * @param  {String} startDate
           * @param  {String} endDate
           * @param  {String} repeat
           * @param  {String} shortDescription
           * @param  {String} description
           * @param  {String} capacity
           *
           */

          let classId = argv.classId.toString();
          let classCode = argv.classCode.toString();
          let room = argv.room.toString();
          let time = argv.time.toString();
          let startDate = argv.startDate.toString();
          let endDate = argv.endDate.toString();
          let repeat = argv.repeat.toString();
          let shortDescription = argv.shortDescription.toString();
          let description = argv.description.toString();
          let capacity = argv.capacity.toString();

          let _class = {
            classId,
            classCode,
            room,
            time,
            startDate,
            endDate,
            repeat,
            shortDescription,
            description,
            capacity
          };

          await conn.updateClassInfo(networkObj, _class);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (
          functionName === 'RemoveClassFromSubject' &&
          user.role === USER_ROLES.ADMIN_ACADEMY
        ) {
          /**
           * Remove Subject From Course
           * @param  {String} classId class Id (required)
           * @param  {String} subjectId subject Id (required)
           */

          let subjectId = argv.subjectId.toString();
          let classId = argv.classId.toString();

          await conn.removeClassFromSubject(networkObj, subjectId, classId);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else {
          console.log('Failed!');
          process.exit(0);
        }
      }
    });
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
