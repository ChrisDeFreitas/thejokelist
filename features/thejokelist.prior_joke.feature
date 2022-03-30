# 
#  thejokelist.prior_joke.feature
#  by Chris DeFreitas
#

Feature: Prior Joke

  Scenario: Retrieve the prior joke by joke.id.
    Given the home page is displayed
    And  the Left Arrow is clicked
    Then the next joke with an id smaller than the last appears
