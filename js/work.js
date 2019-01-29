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
      "id":1,
      "workTypeId":1,
      "workType":"Encuadernados",
      "clossedSizes":["150x210mm"],
      "image":noImage,
      "name":"Cuaderno",
      "quantities":[100,200,300,500,1000],
      "mandatoryFinishGroups":
      [
        {
          "groupName": "Encuadernado",
          "finishes":
          [
            {
              "finish":"Encuadernado HotMelt",
              "finishComment":"",
              "showToClientFinish":true,
              "incidences":
              [
                {
                  "itemId":-1,
                  "type":"optionalFinishes",
                  "action":"add",
                  "values":
                  [
                    {
                      "finish":"Marca Páginas",
                      "finishComment":"",
                      "showToClientFinish":true
                    }
                  ]
                }
              ]
            },
            {
              "finish":"Encuadernado con Rulo Wire-o",
              "finishComment":"",
              "showToClientFinish":true
            }
          ]
        }
      ],
      
      "items":
      [
        {
          "id":0,
          "name":"Tapa y contratapa",
          "bleedPrint":true,
          "inks":[
            {
              "inksDetails":"Full color",
              "inksQuantity":4
            }
          ],
          "openedSize":["150x210mm"],
          "allTheSame":false,
          "quantityOfPages":[2],
          "quantityOfVias":[1],
          "faces":["Simple Faz"],
          "materials":[
            {
              "paper":"Cartulina Blanca/Blanca",
              "gr":"250"
            },
            {
              "paper":"Coteado",
              "gr":"300"
            },
            {
              "paper":"Coteado",
              "gr":"150"
            }
          ],
          "mandatoryFinishGroups":
          [
            {
              "groupName": "Tipo de Tapa",
              "finishes": 
              [
                {
                  "finish":"Tapa Flexible",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      [
                        {
                          "paper":"Cartulina Blanca/Blanca",
                          "gr":"250"
                        },
                        {
                          "paper":"Coteado",
                          "gr":"300"
                        }
                      ]
                    }
                  ]
                },
                {
                  "finish":"Tapa SemiDura",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      {
                        "paper":"Cartulina Blanca/Blanca",
                        "gr":"250"
                      }
                    },
                    {
                      "itemId":-1,
                      "type":"optionalFinishes",
                      "action":"add",
                      "values":
                      [
                        {
                          "finish":"Cierre Elástico",
                          "finishComment":"",
                          "showToClientFinish":true
                        }
                      ]
                    }
                  ]
                },
                {
                  "finish":"Tapa Dura",
                  "finishComment":"",
                  "showToClientFinish":true,
                  "incidences":
                  [
                    {
                      "itemId":0,
                      "type":"materials",
                      "action":"replace",
                      "values":
                      {
                        "paper":"Coteado",
                        "gr":"150"
                      }
                    },
                    {
                      "itemId":-1,
                      "type":"optionalFinishes",
                      "action":"add",
                      "values":
                      [
                        {
                          "finish":"Cierre Elástico",
                          "finishComment":"",
                          "showToClientFinish":true
                        }
                      ]
                    }
                  ]
                }
              ]  
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "comment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "comment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "comment":"",
              "showToClient":true
            }
          ]
        },
        {
          "id":1,
          "name":"Intrior",
          "bleedPrint":true,
          "inks":
          [
            {
              "inksDetails":"Sin imprimir",
              "inksQuantity":0
            },
            {
              "inksDetails":"Tinta Negra",
              "inksQuantity":1
            },
            {
              "inksDetails":"2 tintas",
              "inksQuantity":2
            }
          ],
          "openedSize":["150x210mm"],
          "allTheSame":false,
          "quantityOfPages":[70,100],
          "quantityOfVias":[1],
          "faces":["Doble Faz"],
          "materials":
          [
            {
              "paper":"Obra Blanco",
              "gr":"80"
            },
            {
              "paper":"Obra Blanco",
              "gr":"90"
            },
            {
              "paper":"Rayado estándar",
              "gr":"70"
            }
          ]
        } 
      ]
    }
  ];