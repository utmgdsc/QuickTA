


c = [
  {
    "id": null,
    "course_id": "b8aaff99-8649-4620-97c0-05272fea47b8",
    "semester": "2022F",
    "course_code": "CSC311H5"
  },
  {
    "id": null,
    "course_id": "3ecdd45c-d0ff-41ec-8926-5d4f9abeb0a5",
    "semester": "2022F",
    "course_code": "CSC108H5"
  }
]

// console.log(c.map((course) => ({"course_id":course.course_id, "course_code":course.course_code})));

const l =  [
  {
    "chatlog_id": "0cf52e00-0411-4576-8e7b-8fde2533696d",
    "speaker": "Test User 1",
    "chatlog": "test",
    "time": "2022-11-26T18:55:11.652000Z",
    "delta": "0.0"
  },
  {
    "chatlog_id": "756cf5e9-d228-4379-90c6-6413a96469f8",
    "speaker": "Agent",
    "chatlog": "hi",
    "time": "2022-11-26T18:55:14.194000Z",
    "delta": null
  },
  {
    "chatlog_id": "973c64d3-7e79-4b62-9c41-0a09bb400456",
    "speaker": "Test User 1",
    "chatlog": "test",
    "time": "2022-11-26T18:55:17.291000Z",
    "delta": "3.097911"
  },
  {
    "chatlog_id": "732884db-67db-4334-a2a3-17884c1737fd",
    "speaker": "Agent",
    "chatlog": "hi",
    "time": "2022-11-26T18:55:20.012000Z",
    "delta": null
  }
]

// console.log(l.map(({chatlog, speaker, time, delta}, index) => (
//   {
//     chatlog: chatlog,
//     speaker: speaker,
//     time:time,
//     delta:delta
//   })))

const entry = {
  "chatlog_id": "732884db-67db-4334-a2a3-17884c1737fd",
  "speaker": "Agent",
  "chatlog": "hi",
  "time": "2022-11-26T18:55:20.012000Z",
  "delta": null
}

const empty = [];

function foo(l){
  return l ? "true" : "false" 
}

const  most_common = [
  [
    "Model in SQL",
    0.006143869465035414
  ],
  [
    "Relational Model",
    0.009680866184575549
  ],
  [
    "Relational",
    0.039317476819023006
  ],
  [
    "SQL",
    0.04202073412091895
  ],
  [
    "Model",
    0.047854768538282286
  ],
  [
    "relational database",
    0.07055718463001341
  ],
  [
    "Data",
    0.19322935429172192
  ],
  [
    "database",
    0.20968393894245702
  ],
  [
    "kind",
    0.30424647197835275
  ],
  [
    "databases",
    0.3145259084136855
  ],
  [
    "Querying Data",
    0.3261398464797687
  ],
  [
    "store",
    0.35982042864114594
  ],
  [
    "Querying",
    0.4242483682653183
  ],
  [
    "systems for Querying",
    0.46285266079833076
  ],
  [
    "Querying Data involve",
    0.4928349553356682
  ],
  [
    "Test",
    0.5817828422860997
  ],
  [
    "exist",
    0.6677485283278727
  ],
  [
    "Cool",
    0.6846603279502148
  ],
  [
    "designs",
    0.7127423716922616
  ],
  [
    "expand",
    0.731799730275627
  ],
  [
    "object-oriented",
    0.731799730275627
  ],
  [
    "languages",
    0.7457993458392405
  ],
  [
    "systems",
    0.7457993458392405
  ],
  [
    "involve",
    0.7457993458392405
  ],
  [
    "complex",
    0.7457993458392405
  ]
]

let max = -100
let min = 100
most_common.forEach((word)=>{
  if(word[1] > max){
    max=word[1]
  }
  if (word[1] < min){
    min = word[1]
  }

})

// console.log(max, min)
//
// console.log(most_common.map((word) => ([word[0], 1-((word[1] - min)) / (max - min)])))

// console.log(parseInt("2.3"))
