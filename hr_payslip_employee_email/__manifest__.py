# -*- coding: utf-8 -*-

# Part of Probuse Consulting Service Pvt Ltd. See LICENSE file for full copyright and licensing details.

{
    'name':'Employee Payslips Send by Email',
    'version': '1.0',
    'price': 10.0,
    'currency': 'EUR',
    'category': 'Human Resources',
    'license': 'Other proprietary',
    'description': """
    Employee Payslips Send by Email
    This module allow HR department/Company to send payslips by email at time of confirmation of payslip.

employee payslip
payslip by email
hr payroll
payroll
payslip to employee by email
email payslips
payslip report
salary slip
employee salary
salary slip by email
mail payslip
payslip by email to employee
employee payslip
employee payslip mail
employee payslip email
email payroll
email payslip
email employee payslip
send by email payslip
payslip send by email
email to employee payslip
payslip send
payslip send to employee
payslip compute
salary rule
payroll
hr payroll
hr payslip

            """,
    'author' : 'Probuse Consulting Service Pvt. Ltd.',
    'website': 'www.probuse.com',
    'depends': ['hr_payroll'],
    'images': ['static/description/1234.png'],
    
    'data':[
            'data/employee_payslip_data.xml',
            'views/hr_view.xml',
            ],
    'installable': True,
    'application': False,
}

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
