export class DateLib
{
    static date(format = "Y-m-d H:i:s", unixtime = 0) {
        let date = new Date(unixtime * 1000);
        if (unixtime < 1)
            date = new Date();
        let d = date.getDate();
        if (d < 10) d = '0' + d;
        let m = date.getMonth() + 1; //January is 0!
        if (m < 10) m = '0' + m;
        let Y = date.getFullYear();
        let H = date.getHours();
        if (H < 10)
            H = '0' + H;
        let i = date.getMinutes();
        if (i < 10)
            i = '0' + i;
        let s = date.getSeconds();
        if (s < 10)
            s = '0' + s;

        let replaceWith = [
            ["Y", Y],
            ["m", m],
            ["w", date.getDay()],
            ["W", 0],
            ["d", d],
            ["H", H],
            ["i", i],
            ["s", s],
        ];
        for (let key in replaceWith) {
            let [find, replace] = replaceWith[key];
            format = format.replace(find, replace);
        }
        return format;
    }
}
