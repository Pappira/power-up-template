var works = [
    {
      'id':0,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'94x54cm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['94x54cm']
            },
          ]
        }
      ],
      'image':tarjetaImage,
      'name':'Tarjetas Personales',
      'quantity':[50,100,200,300,500,1000],
      "mandatoryFinishGroups":
      [
        {
          "groupName": "Variaciones",
          "finishes":
          [
            {
              "finish":"Todas iguales",
              "finishComment":"Todas las tarjetas personales a imprimir son idénticas, sin ningún tipo de variante",
              "showToClientFinish":false
            },
            {
              "finish":"1 cambio de nombre",
              "finishComment":"Todas las tarjetas personales tienen el mismo diseño base, y la única variante es que se tendrá datos personales de 2 personas",
              "showToClientFinish":true
            },
            {
              "finish":"2 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"3 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"4 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"5 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"6 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"7 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"8 cambios de nombre",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"9 cambios de nombres",
              "finishComment":"",
              "showToClientFinish":true
            }
          ]
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
              'inksDetails':'1 Tinta negra',
              'inksQuantity':1,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'quantityOfVias':[1],
          'openedSize':[],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Opalina Lisa',
              'gr':'240'
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    },
    {
      "id":1,
      "workTypeId":1,
      "workType":"Encuadernados",
      "image":noImage,
      "name":"Cuaderno",
      "clossedSizes":["150x210mm"],
      "quantity":[50,100,200,300,500,1000],
      "mandatoryFinishGroups":
      [
        {
          "groupName": "Encuadernado",
          "finishes":
          [
            {
              "finish":"HotMelt",
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
              "finish":"Rulo Wire-o",
              "finishComment":"",
              "showToClientFinish":true
            },
            {
              "finish":"Cosido con dos grapas",
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
                      [{
                        "paper":"Cartulina Blanca/Blanca",
                        "gr":"250"
                      }]
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
          "quantityOfPages":[2],
          "quantityOfVias":[1],
          "faces":["Simple Faz","Doble Faz"],
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
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            }
          ]
        },
        {
          "id":1,
          "name":"Interior",
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
          "quantityOfPages":[50,70,100],
          "quantityOfVias":[1],
          "faces":["Simple Faz","Doble Faz"],
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
      ],
      "optionalFinishes":[]
    },{
      'id':2,
      'workTypeId':0,
      'workType':'Tarjetería',
      'clossedSizes':[
        {
          'value':'150x150mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['150x150mm']
            },
          ]
        },        
        {
          'value':'130x170mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['130x170mm']
            },
          ]
        },        
        {
          'value':'120x180mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['120x180mm']
            },
          ]
        },        
        {
          'value':'130x190mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['130x190mm']
            },
          ]
        },        
        {
          'value':'150x220mm',
          "mandatoryChanges":
          [
            {
              "itemId":0,
              "type":"openedSize",
              "values":['150x220mm']
            },
          ]
        }
      ],
      'image':noImage,
      'name':'Tarjetas de invitación',
      'quantity':[10,50,100,300],
      'items':[
        {
          'id':0,
          'name':'Tarjeta',
          'bleedPrint':true, 
          'inks':[
            {
              'inksDetails':'Full color',
              'inksQuantity':4,
            }
          ],
          'allTheSame':false,
          'quantityOfPages':[1],
          'openedSize':[],
          'quantityOfVias':[1],
          'faces':['Simple Faz','Doble Faz'],
          'materials':[
            {
              'paper':'Coteado',
              'gr':'300'
            },
            {
              'paper':'Magic',
              'gr':''
            },
            {
              'paper':'Jazmine',
              'gr':''
            }
          ],
          "optionalFinishes":
          [
            {
              "finish":"Laminado Mate",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Brillo",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Laminado Mate o Brillo a definir",
              "finishComment":"",
              "showToClient":true
            },
            {
              "finish":"Puntas redondeadas",
              "finishComment":"",
              "showToClient":true
            }
          ]
        }
      ]
    }
  ];