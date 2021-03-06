'use strict';

const TASTING_EVENTS_LIST_URL = `/events`;
// ************************************************************************* //
// API POST - BEGIN
// ************************************************************************* //

function postDataToApi(url, options, callback) {

  const token = localStorage.getItem('token');

  $.ajax({
    url: url,
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    headers: {"authorization": token},
    data: JSON.stringify(options),
    dataType: 'json',
    success: callback,
    error: function(err) { console.log('something went wrong', err); },
  });

}

// ************************************************************************* //
// API POST - END
// ************************************************************************* //

// ************************************************************************* //
// HANDLE SUBMIT - BEGIN
// ************************************************************************* //
function handleFormSubmit(e) {
  e.preventDefault();

  // FOR PRODUCTION
  let eventHost = localStorage.getItem('eventHost');
  let eventName = localStorage.getItem('eventName');
  let wineName = $('#js-wine-name-input').val();
  let country = $('#js-country-select').val();
  let countryMapSrc = $('.js-country-map-img').attr('src');
  let primaryAppellation = $('#js-primary-appellation-select').val();
  let primaryAppellationMapSrc = $('.js-primary-app-map-img').attr('src');
  let secondaryAppellation = $('#js-secondary-appellation-select').val();
  let secondaryAppellationMapSrc = $('.js-secondary-app-map-img').attr('src');
  let primaryGrape = $('#js-primary-grape-select').val();
  let rating = $('#js-rating-select').val();
  let pricing1Desc = $('#js-pricing1-select').val();
  let pricing1Price = $('#js-pricing1-input').val();
  let pricing2Desc = $('#js-pricing2-select').val();
  let pricing2Price = $('#js-pricing2-input').val();
  let pricing3Desc = $('#js-pricing3-select').val();
  let pricing3Price = $('#js-pricing3-input').val();
  let pricing4Desc = $('#js-pricing4-select').val();
  let pricing4Price = $('#js-pricing4-input').val();
  let tastingNotes = $('#js-tasting-note-ta').val();

  // TODO - code Server-side Validation.
  // Server-side Validation

  // if ( !country ) { country = 'Not Selected'; } // not needed, this is a required field.
  if ( !countryMapSrc ) { countryMapSrc = ''; }
  if ( !primaryAppellation ) { primaryAppellation = 'Not Selected'; }
  if ( !primaryAppellationMapSrc ) { primaryAppellationMapSrc = ''; }
  if ( !secondaryAppellation ) { secondaryAppellation = 'Not Selected'; }
  if ( !secondaryAppellationMapSrc ) { secondaryAppellationMapSrc = ''; }
  // if ( !primaryGrape ) { primaryGrape = 'No Primary Grape Selected'; }  // not needed, this is a required field.
  // if ( !rating ) { rating = 'No Rating Selected'; } // not needed, this is a required field.

  const options = {
    eventHost,
    eventName,
    wineName,
    country,
    countryMapSrc,
    primaryAppellation,
    primaryAppellationMapSrc,
    secondaryAppellation,
    secondaryAppellationMapSrc,
    primaryGrape,
    rating,
    pricing1Desc,
    pricing1Price,
    pricing2Desc,
    pricing2Price,
    pricing3Desc,
    pricing3Price,
    pricing4Desc,
    pricing4Price,
    tastingNotes
  };

  const eventId = localStorage.getItem('eventId');
  postDataToApi(`/api/tastings/${eventId}`, options, redirectToEventsListOnSave);
}

function redirectToEventsListOnCancel() {
  window.location = TASTING_EVENTS_LIST_URL;
}

function redirectToEventsListOnSave() {
  // on AJAX success, navigate the user back to TASTING EVENTS LIST.
  window.location = TASTING_EVENTS_LIST_URL;
}
// ************************************************************************* //
// HANDLE SUBMIT - END
// ************************************************************************* //

$(function() {

  // listeners
  const $cancelButton = $('.js-button-cancel');
  const newTastingNoteForm = $('.tasting-form');
  $cancelButton.on('click', redirectToEventsListOnCancel);
  newTastingNoteForm.on('submit', handleFormSubmit);
});