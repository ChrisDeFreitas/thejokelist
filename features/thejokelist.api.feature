# 
#  thejokelist.api.feature
#  by Chris DeFreitas
#

@idEndpoint
Feature: Verify the API endpoints

  Scenario: Calling the id endpont.
    When the id enpoint is called with a joke.id
    Then the returned status equals 200
    And the returned joke has the same joke.id
    
