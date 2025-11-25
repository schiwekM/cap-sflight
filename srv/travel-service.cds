using { sap.fe.cap.travel as my } from '../db/schema';

service TravelService @(path:'/processor') {

  @(restrict: [
    { grant: 'READ', to: 'authenticated-user'},
    { grant: ['rejectTravel','acceptTravel','deductDiscount'], to: 'reviewer'},
    { grant: ['*'], to: 'processor'},
    { grant: ['*'], to: 'admin'}
  ])
  @cds.redirection.target
  entity Travel as projection on my.Travel actions {
    action createTravelByTemplate() returns Travel;
    action rejectTravel();
    action acceptTravel();
    action deductDiscount( percent: Percentage not null ) returns Travel;
  };

  @EnterpriseSearch.model: true
  @EnterpriseSearch.resultItemKey: ['TravelID']
  @EnterpriseSearch.title: { titleField: 'Description' }
  @EnterpriseSearch.modelName: '{i18n>Travel}'
  @EnterpriseSearch.modelNamePlural: '{i18n>Travels}'
  @Consumption.semanticObject: 'Travel'
  @(restrict: [
    { grant: ['READ'], to: 'reviewer'},
    { grant: ['READ'], to: 'processor'},
    { grant: ['READ'], to: 'admin'}
  ])
  entity ListOfTravels as projection on my.Travel {
    key TravelID,
    @EnterpriseSearch.freeStyleField: { importance: #HIGH, withAutoCompletion: true }
    @EnterpriseSearch.responseField.standard: { displayPosition: 1 }
    @Search.fuzzinessThreshold: 0.77
    BeginDate,
    EndDate,
    @EnterpriseSearch.freeStyleField: { importance: #HIGH }
    @EnterpriseSearch.responseField.standard: { displayPosition: 2 }
    Description,
    BookingFee,
    CurrencyCode.code as CurrencyCode,
    @EnterpriseSearch.freeStyleField: { importance: #HIGH }
    @EnterpriseSearch.responseField.standard: { displayPosition: 3 }
    to_Agency.Name as agency
  }
}

type Percentage : Integer @assert.range: [1,100];
