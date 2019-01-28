var works = [
    {
      'id':0,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':['90x54mm'],
      'image':noImage,
      'name':'Tarjetas Personales',
      'quantities':[100,200,300,500,1000],
      'finishes':[
        {
          'finish':'Tapa SemiDura',
          'finishComment':'asd',
          'showToClientFinish':true
        },
        {
          'finish':'Encuadernado HotMelt',
          'finishComment':'',
          'showToClientFinish':false
        }
      ],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true,
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            },
            {
              'inksDetails':'3 Tintas',
              'inksQuantity':3,
            },
            {
              'inksDetails':'2 Tintas',
              'inksQuantity':2,
            },
            {
              'inksDetails':'1 Tinta',
              'inksQuantity':1,
            },
            {
              'inksDetails':'1 Tinta negra',
              'inksQuantity':1,
            }
          ],
          'openedSize':['90x54mm','90x50mm'],
          'allTheSame':false,
          'quantityOfPages':[1,2,3],
          'quantityOfVias':[1],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado Mate',
              'gr':'300'
            },
            {
              'paper':'Opalina Lisa',
              'gr':'240'
            }
          ],
          'finishes':[
            {
              'finish':'Laminado Mate',
              'comment':'asd',
              'showToClient':true
            }
          ]
        }
      ]
    },
    {
      'id':1,
      'workTypeId':1,
      'workType':'Encuadernados',
      'clossedSizes':['150x210mm'],
      'image':noImage,
      'name':'Cuaderno',
      'quantities':[100,200,300,500,1000],
      'finishes':[
        {
          'finish':'Tapa SemiDura',
          'finishComment':'asd',
          'showToClientFinish':true
        },
        {
          'finish':'Encuadernado HotMelt',
          'finishComment':'',
          'showToClientFinish':false
        }
      ],
      'items':[
        {
          'id':0,
          'name':'Tapa y contratapa',
          'bleedPrint':true,
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            }
          ],
          'openedSize':['150x210mm'],
          'allTheSame':false,
          'quantityOfPages':[2],
          'quantityOfVias':[1],
          'faces':['Simple Faz'],
          'materials':[
            {
              'paper':'Cartulina Blanca/Blanca',
              'gr':'250'
            }
          ],
          'finishes':[
            {
              'finish':'Laminado Mate',
              'comment':'asd',
              'showToClient':true
            }
          ]
        },
        {
          'id':1,
          'name':'Intrior',
          'bleedPrint':true,
          'inks':[
            {
              'inksDetails':'Tinta Negr',
              'inksQuantity':1,
            }
          ],
          'openedSize':['150x210mm'],
          'allTheSame':false,
          'quantityOfPages':[70,100],
          'quantityOfVias':[1],
          'faces':['Doble Faz'],
          'materials':[
            {
              'paper':'Obra Blanco',
              'gr':'80'
            }
          ],
          'finishes':[
            {
              'finish':'Laminado Mate',
              'comment':'asd',
              'showToClient':true
            }
          ]
        }
      ]
    }
  ];