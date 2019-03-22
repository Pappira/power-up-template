var translate = function(key){
    switch (expr) {
        case 'workTypeId':
            return 'WTI'; 
        case 'workType':
            return 'WT';
        case 'image':
            return 'IM';
        case 'name':
            return 'Na';
        case 'clossedSizes':
            return 'CS';
        case 'quantities':
            return 'Q';
        case 'mandatoryFinishGroups':
            return 'MFG';
        case 'groupName':
            return 'GN';
        case 'finishes':
            return 'F';
        case 'finish':
            return 'f';
        case 'finishComment':
            return 'FC';
        case 'showToClientFinish':
            return 'SCF';
        case 'incidences':
            return 'In';
        case 'itemId':
            return 'IId';
        case 'type':
            return 'T';
        case 'action':
            return 'A';
        case 'values':
            return 'V';
        case 'items':
            return 'I';
        case 'bleedPrint':
            return 'BP';
        case 'inks':
            return 'Ik';
        case 'inksDetails':
            return 'ID';
        case 'openedSize':
            return 'OZ';
        case 'allTheSame':
            return 'AS';
        case 'optionalFinishes':
            return 'OF';
        case 'quantityOfPages':
            return 'QP';
        case 'quantityOfVias':
            return 'QV';
        case 'faces':
            return 'Fa';
        case 'materials':
            return 'M';
        case 'paper':
            return 'P';
        case 'price':
            return 'Pr';
      /*  case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';*/
        default:
            return key;
    }
}

var deTranslate = function(key){
    switch (expr) {
        case 'WTI': 
            return 'workTypeId';
        case 'WT':
            return 'workType';
        case 'IM':
            return 'image';
        case 'Na':
            return 'name';
        case 'CS':
            return 'clossedSizes';
        case 'Q':
            return 'quantities';
        case 'MFG':
            return 'mandatoryFinishGroups';
        case 'GN':
            return 'groupName';
        case 'F':
            return 'finishes';
        case 'f':
            return 'finish';
        case 'FC':
            return 'finishComment';
        case 'SCF':
            return 'showToClientFinish';
        case 'In':
            return 'incidences';
        case 'IId':
            return 'itemId';
        case 'T':
            return 'type';
        case 'A':
            return 'action';
        case 'V':
            return 'values';
        case 'I':
            return 'items';
        case 'BP':
            return 'bleedPrint';
        case 'Ik':
            return 'inks';
        case 'ID':
            return 'inksDetails';
        case 'OZ':
            return 'openedSize';
        case 'AS':
            return 'allTheSame';
        case 'OF':
            return 'optionalFinishes';
        case 'QP':
            return 'quantityOfPages';
        case 'QV':
            return 'quantityOfVias';
        case 'Fa':
            return 'faces';
        case 'M':
            return 'materials';
        case 'P':
            return 'paper';
        case 'Pr':
            return 'price';
        /*case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';
        case '':
            return '';*/
        default:
            return key;
    }
}