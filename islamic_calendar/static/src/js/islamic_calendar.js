odoo.define('islamic_calendar.islamic_calendar', function (require) {
"use strict"

var core = require('web.core');
var datepicker = require('web.datepicker');
var datetimefield = require('web.basic_fields');
var ListRenderer = require('web.ListRenderer');
var time = require('web.time');
var field_utils = require('web.field_utils');
var session = require('web.session');

var _t = core._t;
var qweb = core.qweb;
var lang = '';
var date_format = '%m/%d/%Y';

datepicker.DateWidget.include({
    start: function() {
        var def = new $.Deferred();;
        this.$input = this.$('input.oe_datepicker_master');
        this.$input_picker = this.$('input.oe_datepicker_container');
        this.$input_hijri = this.$el.find('input.oe_hijri');
        $(this.$input_hijri).val('');
        this._super();
        this.$input = this.$('input.oe_datepicker_master');
        var self = this;
        function convert_to_hijri(date) {
            if (date.length == 0) {
                return false
            }
            var jd = $.calendars.instance('islamic').toJD(parseInt(date[0].year()),parseInt(date[0].month()),parseInt(date[0].day()));
            var date = $.calendars.instance('gregorian').fromJD(jd);
            var date_value = new Date(parseInt(date.year()),parseInt(date.month())-1,parseInt(date.day()));
            self.$el.find('input.oe_simple_date').val(self.formatClient(date_value, self.type_of_date));
            self.change_datetime();
        }
        this._rpc({
                    model: 'res.users',
                    method: 'get_localisation',
                    args: [session.uid],
        }).then(function (res) {
            def.resolve(res);
        });
        def.done(function(val) {
            $(self.$input_hijri).calendarsPicker({
                calendar: $.calendars.instance('islamic',val.lang),
                dateFormat: 'M d, yyyy',
                onSelect: convert_to_hijri,
            });
        });
        
    },
    formatClient: function (value, type) {
        if (type == 'datetime'){
            var date_format = time.getLangDatetimeFormat();
        }
        if (type == 'date'){
            var date_format = time.getLangDateFormat();
        }
        return moment(value).format(date_format);
    },
    convert_greg_to_hijri: function(text) {
        if (text) {
            var cal_greg = $.calendars.instance('gregorian');
            var cal_hijri = $.calendars.instance('islamic');
            var text = text._i;
            if (text.indexOf('-')!= -1){
                var text_split = text.split('-');
                var year = parseInt(text_split[0]);
                var month = parseInt(text_split[1]);
                var day = parseInt(text_split[2]);

                var jd = cal_greg.toJD(year,month,day);
                var date = cal_hijri.fromJD(jd);
                var m = (date.month() >=10 ? date.month():"0"+date.month());
                var d = (date.day() >=10 ? date.day():"0"+date.day());
                $(this.$input_hijri).val(cal_hijri.formatDate('M d, yyyy', date));
            }

            if(text.indexOf('/')!= -1){
                var text_split = text.split('/');
                var year = parseInt(text_split[2]);
                var month = parseInt(text_split[0]);
                var day = parseInt(text_split[1]);

                var jd = cal_greg.toJD(year,month,day);
                var date = cal_hijri.fromJD(jd);
                var m = (date.month() >=10 ? date.month():"0"+date.month());
                var d = (date.day() >=10 ? date.day():"0"+date.day());
                $(this.$input_hijri).val(cal_hijri.formatDate('M d, yyyy', date));
            }
        }
    },
    set_value_from_ui: function() {
        var value = this.$input.val() || false;
        this.value = this._parseClient(value);
        this.setValue(this.value);
        var new_date = this.value;

        // @Jay: special fix for non English language date convert to English
        if (this.value.locale() != "en") {
            new_date = {'_i': this.value.locale("en").format('MM/DD/YYYY')}
        }

        this.convert_greg_to_hijri(new_date);
    },
    set_readonly: function(readonly) {
        this._super(readonly);
        this.$input_hijri.prop('readonly', this.readonly);
    },
    change_datetime: function(e) {
        this._setValueFromUi();
        this.trigger("datetime_changed");

        // Prevent to stop auto close filter popup to reopen
        var $el = this.$el;
        setTimeout(function(){
            if ($el.closest('.o_filters_menu').length){
                $el.closest('.o_filters_menu').parent().addClass('show');
                $el.closest('.o_filters_menu').addClass('show');
            }
        }, 400);
    },
    changeDatetime: function () {
        if (this.isValid()) {
            var oldValue = this.getValue();
            this.set_value_from_ui();
            var newValue = this.getValue();

            if (!oldValue !== !newValue || oldValue && newValue && !oldValue.isSame(newValue)) {
                this.trigger("datetime_changed");
            }
        }
    },
});

datetimefield.FieldDate.include({
    start: function () {
        var self = this;
        this._super();
        if (this.mode === 'readonly') {
            var date_value = $(this.$el).text();

            // @Jay: special fix for non English language date convert to English
            if (this.datepickerOptions.defaultDate && this.datepickerOptions.defaultDate.locale() != 'en') {
                var assign_dt = moment($(this.$el).text(), 'DD MMM, YYYY').locale('ar');
                date_value = assign_dt.locale("en").format('MM/DD/YYYY');
            }

            var hij_date = self.convert_greg_to_hijri(date_value);
            if(typeof(hij_date) == "undefined")
                this.$el.append("<div><span class='oe_hijri'>"+date_value+"</span></div>");
            else
                this.$el.append("<div><span class='oe_hijri'>"+hij_date+"</span></div>");
        }
        return true;
    },
    convert_greg_to_hijri: function(text) {
        if (text) {
            var cal_greg = $.calendars.instance('gregorian');
            var cal_hijri = $.calendars.instance('islamic');
            if (text.indexOf('-')!= -1){
                var text_split = text.split('-');
                var year = parseInt(text_split[0]);
                var month = parseInt(text_split[1]);
                var day = parseInt(text_split[2]);

                var jd = cal_greg.toJD(year,month,day);
                var date = cal_hijri.fromJD(jd);
                var m = (date.month() >=10 ? date.month():"0"+date.month());
                var d = (date.day() >=10 ? date.day():"0"+date.day());
                return cal_hijri.formatDate('M d, yyyy', date);
            }

            if(text.indexOf('/')!= -1){
                var text_split = text.split('/');
                var year = parseInt(text_split[2]);
                var month = parseInt(text_split[0]);
                var day = parseInt(text_split[1]);

                var jd = cal_greg.toJD(year,month,day);
                var date = cal_hijri.fromJD(jd);
                var m = (date.month() >=10 ? date.month():"0"+date.month());
                var d = (date.day() >=10 ? date.day():"0"+date.day());
                return cal_hijri.formatDate('M d, yyyy', date);
            }
        }
    },
});

ListRenderer.include({
    _renderBodyCell: function (record, node, index, options) {
        var $cell = this._super.apply(this, arguments);

        var name = node.attrs.name;
        var field = this.state.fields[name];

        if (field && field.type == 'datetime') {
            // Here we get 3 different type value
            // 1. Simple datetime value while render first time
            // 2. HTML node get while in edit mode
            // 3. Read only datetime value are in span tag we do not do anything on that case
            if ($cell.find('input.o_datepicker_input').length > 0) {
                var text =  $cell.find('input.o_datepicker_input').val();
                var cal_greg = $.calendars.instance('gregorian');
                var cal_hijri = $.calendars.instance('islamic');

                if(text.indexOf('/')!= -1){
                    var text_split = text.split('/');
                    var year = parseInt(text_split[2]);
                    var month = parseInt(text_split[0]);
                    var day = parseInt(text_split[1]);
                    var jd = cal_greg.toJD(year,month,day);
                    var date = cal_hijri.fromJD(jd);
                    var m = (date.month() >=10 ? date.month():"0"+date.month());
                    var d = (date.day() >=10 ? date.day():"0"+date.day());
                    var hijri_value = cal_hijri.formatDate('M d, yyyy', date);
                    var fina_value = text + ' (' + hijri_value + ')';
                    $cell.find('input.o_datepicker_input').val(fina_value);
                }
            }
            else {
                var text = $cell.html();
                if (text.length < 20) {
                    var cal_greg = $.calendars.instance('gregorian');
                    var cal_hijri = $.calendars.instance('islamic');

                    if(text.indexOf('/')!= -1){
                        var text_split = text.split('/');
                        var year = parseInt(text_split[2]);
                        var month = parseInt(text_split[0]);
                        var day = parseInt(text_split[1]);
                        var jd = cal_greg.toJD(year,month,day);
                        var date = cal_hijri.fromJD(jd);
                        var m = (date.month() >=10 ? date.month():"0"+date.month());
                        var d = (date.day() >=10 ? date.day():"0"+date.day());
                        var hijri_value = cal_hijri.formatDate('M d, yyyy', date);
                        var fina_value = text + ' (' + hijri_value + ')';
                        $cell.html(fina_value);
                    }
                }
            }
        }
        return $cell;
    }

});

});
