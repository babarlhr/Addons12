#-*- coding:utf-8 -*-

from odoo import api, fields, models

class HrPayslip(models.Model):
    _inherit = 'hr.payslip'

    @api.multi
    def action_payslip_done(self):
        res = super(HrPayslip, self).action_payslip_done()
        for rec in self:
            if rec.employee_id.payslip_by_email:
                template = self.env.ref('hr_payslip_employee_email.email_template_employee_payslip_send_new')
                template.send_mail(rec.id, force_send=True)
        return res

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
