import {Lang} from "fogito-core-ui";

export class Parameters {

    static noImgUrl = process.env.publicPath+'/assets/images/no-img.png';

    static getGenerationTypes() {
        return [
            {value: 'auto', title: Lang.get('Auto')},
            {value: 'manual', title: Lang.get('Manual')},
        ];
    };

    static getGenerationRepeatTypes() {
        return [
            {value: 'day', title: Lang.get('Day')},
            {value: 'week', title: Lang.get('Week')},
            {value: 'month', title: Lang.get('Month')},
            {value: 'year', title: Lang.get('Year')},
        ];
    }

    static getGenerationEndTypes() {
        return [
            {value: 'never', title: Lang.get('Never')},
            {value: 'date', title: Lang.get('Date')},
            {value: 'after', title: Lang.get('After')},
        ];
    }

    static getWeekDays() {
        return [
            {value: 1, title: Lang.get('Monday')},
            {value: 2, title: Lang.get('Tuesday')},
            {value: 3, title: Lang.get('Wednesday')},
            {value: 4, title: Lang.get('Thursday')},
            {value: 5, title: Lang.get('Friday')},
            {value: 6, title: Lang.get('Saturday')},
            {value: 7, title: Lang.get('Sunday')},
        ];
    }

    static getStatusList() {
        return [
            {value: 1, label: Lang.get('Active'), color: '#2dce89'},
            {value: 2, label: Lang.get('InProgress'), color: '#ffd600'},
            {value: 3, label: Lang.get('Closed'), color: '#d70315'},
        ];
    }

    static getRequestMethods() {
        return [
            {value: 'get', label: Lang.get('get')},
            {value: 'post', label: Lang.get('post')},
            {value: 'put', label: Lang.get('put')},
            {value: 'delete', label: Lang.get('delete')},
            {value: 'multipart', label: Lang.get('multipart')},
        ];
    }

    static getVariableTypes() {
        return [
            {value: 'string', label: 'string',},
            {value: 'int', label: 'int',},
            {value: 'float', label: 'float',},
            {value: 'bool', label: 'bool',},
            {value: 'array', label: 'array',},
            {value: 'object', label: 'object',},
        ];
    }

    static getMonths() {
        return [
            Lang.get('January'),
            Lang.get('February'),
            Lang.get('March'),
            Lang.get('April'),
            Lang.get('May'),
            Lang.get('June'),
            Lang.get('July'),
            Lang.get('August'),
            Lang.get('September'),
            Lang.get('October'),
            Lang.get('November'),
            Lang.get('December'),
        ];
    }


}
