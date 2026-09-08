import { Service } from '@angular/core';

@Service()
export class Validation {
    // Email
  static emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Indian Mobile Number
  static phonePattern = /^[6-9]\d{9}$/;

  // Name (Only letters and spaces)
  static namePattern = /^[A-Za-z ]+$/;

  // Username
  static usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;

  // Password
  static passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // PAN Card
  static panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  // Aadhaar Number
  static aadhaarPattern =/^[2-9]{1}[0-9]{11}$/;

  // GST Number
  static gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

  // PIN Code
  static pincodePattern = /^[1-9][0-9]{5}$/;

  // Website URL
  static websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;

  // Only Numbers
  static numberPattern = /^[0-9]+$/;

  // Decimal Numbers
  static decimalPattern = /^\d+(\.\d{1,2})?$/;

  // Alphanumeric
  static alphaNumericPattern = /^[a-zA-Z0-9 ]+$/;

  // Company Name
  static companyNamePattern = /^[a-zA-Z0-9&.,()\- ]+$/;

  // Address
  static addressPattern = /^[a-zA-Z0-9\s,./#()-]+$/;

  // Employee ID
  static employeeIdPattern = /^[A-Za-z0-9_-]+$/;

  // No Special Characters
  static noSpecialCharPattern = /^[a-zA-Z0-9 ]*$/;

  // LinkedIn URL
  static linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;

  // Date (YYYY-MM-DD)
  static datePattern = /^\d{4}-\d{2}-\d{2}$/;
}
