#-*- coding:utf-8 -*-

from odoo import api, fields, models

class HrEmployee(models.Model):
    _inherit = 'hr.employee'
    
    payslip_by_email = fields.Boolean(
        string='Payslip by Email',
        default=True,
    )
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
