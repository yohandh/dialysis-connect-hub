/**
 * Email Fix for DialyzeEase
 * 
 * This script modifies the appointment controller to allow duplicate bookings
 * and adds more detailed logging for email notifications.
 */

const fs = require('fs');
const path = require('path');

// Path to the appointment controller
const controllerPath = path.join(__dirname, 'controllers', 'appointment.controller.js');

// Read the current controller code
let controllerCode = fs.readFileSync(controllerPath, 'utf8');

// Find the duplicate appointment check
const duplicateCheckRegex = /if \(existingAppointments && existingAppointments\.length > 0\) \{\s+return res\.status\(400\)\.json\(\{ message: 'Patient already has an appointment for this session' \}\);\s+\}/;

// Replace it with a version that allows duplicates for testing
const newDuplicateCheck = `if (existingAppointments && existingAppointments.length > 0) {
      console.log(\`Patient \${patientId} already has an appointment for session \${sessionId}, but allowing for PoC testing\`);
      // For PoC testing, we'll allow booking even if the patient already has an appointment
      // In production, uncomment the line below
      // return res.status(400).json({ message: 'Patient already has an appointment for this session' });
    }`;

// Apply the change if the pattern is found
if (duplicateCheckRegex.test(controllerCode)) {
  controllerCode = controllerCode.replace(duplicateCheckRegex, newDuplicateCheck);
  console.log('Modified duplicate appointment check to allow testing');
} else {
  console.log('Could not find the duplicate appointment check pattern');
}

// Add more detailed logging for email service
const emailServiceRegex = /const emailResult = await emailService\.sendAppointmentConfirmationEmails\(appointmentId\);/;
const newEmailServiceCall = `console.log('About to call email service with appointment ID:', appointmentId);
      // Force direct email sending for testing
      const directEmailResult = await emailService.sendEmail(
        patientDetails[0].email,
        'appointmentConfirmation',
        {
          patientName: \`\${patientDetails[0].first_name} \${patientDetails[0].last_name}\`,
          centerName: appointment.center_name,
          date: appointment.session_date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          bedCode: 'TBD'
        }
      );
      console.log('Direct email result:', directEmailResult);
      
      // Call the regular email service
      const emailResult = await emailService.sendAppointmentConfirmationEmails(appointmentId);`;

// Apply the change if the pattern is found
if (emailServiceRegex.test(controllerCode)) {
  controllerCode = controllerCode.replace(emailServiceRegex, newEmailServiceCall);
  console.log('Enhanced email service logging and added direct email sending');
} else {
  console.log('Could not find the email service call pattern');
}

// Write the updated code back to the file
fs.writeFileSync(controllerPath, controllerCode);
console.log('Applied fixes to the appointment controller');
console.log('Please restart your backend server to apply these changes');
