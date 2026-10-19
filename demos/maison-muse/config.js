// Reusable studio configuration. Enable one category or any combination.
// All prices and schedules are demonstration data, not a connected salon diary.
window.STUDIO = {
 name: 'maison muse', palette: 'plum',
 categories: [
  {id:'nails',name:'Nails',tag:'THE FINISHING TOUCH',description:'Signature colour. Beautiful detail.',enabled:true},
  {id:'lashes',name:'Lashes',tag:'A LITTLE DEFINITION',description:'A softer flutter. An effortless lift.',enabled:true},
  {id:'brows',name:'Brows',tag:'YOUR PERFECT FRAME',description:'Thoughtful shape. Your natural expression.',enabled:true},
  {id:'skin',name:'Skin & aesthetics',tag:'A FRESH PERSPECTIVE',description:'Considered care, starting with you.',enabled:true},
  {id:'massage',name:'Massage',tag:'TIME TO EXHALE',description:'Loosen your shoulders. Find your calm.',enabled:true}
 ],
 services:[
  {id:'gel',category:'nails',name:'The signature gel manicure',description:'Nail shaping, cuticle care and your choice of gel colour.',price:35,duration:60,tag:'A LITTLE FAVOURITE'},
  {id:'builder',category:'nails',name:'Builder gel manicure',description:'A structured overlay with a polished, natural finish.',price:45,duration:75},
  {id:'pedicure',category:'nails',name:'The slow-down pedicure',description:'A foot soak, careful grooming and a glossy finishing touch.',price:42,duration:60},
  {id:'art',category:'nails',name:'Minimal nail art',description:'A delicate detail or simple accent. Add to a manicure.',price:10,duration:15,requires:['gel','builder']},
  {id:'lift',category:'lashes',name:'Lash lift & tint',description:'A lifted look that works with your natural lashes. Patch-test advice applies.',price:48,duration:60},
  {id:'classic',category:'lashes',name:'Classic lash extensions',description:'An individually styled set, from understated to defined.',price:65,duration:120},
  {id:'infill',category:'lashes',name:'Classic lash infill',description:'A refresh for an existing set, subject to a condition check.',price:38,duration:60},
  {id:'sculpt',category:'brows',name:'The signature brow sculpt',description:'A tailored shape and finish to frame your features.',price:25,duration:30},
  {id:'lamination',category:'brows',name:'Brow lamination & shape',description:'A brushed-up finish with thoughtful shaping. Patch-test advice applies.',price:45,duration:45},
  {id:'tint',category:'brows',name:'Brow shape & tint',description:'Soft definition with a bespoke shade and sculpt.',price:30,duration:30},
  {id:'facial',category:'skin',name:'The reset facial',description:'A gentle cleansing and pampering facial ritual.',price:65,duration:60},
  {id:'aesthetic',category:'skin',name:'Aesthetics consultation',description:'A personal assessment of your goals and suitable options. Consultation only; no treatment is included.',price:30,duration:30,tag:'CONSULTATION FIRST'},
  {id:'filler',category:'skin',name:'Dermal filler consultation',description:'Discuss suitability, expectations and questions with your practitioner. Treatment is quoted separately.',price:30,duration:30},
  {id:'back',category:'massage',name:'Back, neck & shoulders',description:'A focused pause for your busiest muscles.',price:38,duration:30},
  {id:'fullbody',category:'massage',name:'The full-body unwind',description:'An unhurried massage with pressure tailored to your preference.',price:65,duration:60},
  {id:'ritual',category:'massage',name:'The extended escape',description:'A longer full-body ritual with time to settle into stillness.',price:90,duration:90}
 ]
};
