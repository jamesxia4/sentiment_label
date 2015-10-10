/**
 * Created by gzlimeng2014 on 2014/12/31.
 */

jQuery.fn.dataTableExt.aTypes.unshift(
    function ( sData )
    {
        var sValidChars = "0123456789,.";
        var Char;
        /*如果末位是%则说明可能是百分比数字*/
        if ( sData.toString().charAt(sData.length-1) === '%' ) {
            /* Check the numeric part */
            for ( var i=0 ; i<sData.length ; i++ )
            {
                Char = sData.charAt(i);
                if (sValidChars.indexOf(Char) == -1)
                {
                    return null;
                }
            }
            return 'percent';
        }
        return null;
    }
);