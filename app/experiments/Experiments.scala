package experiments

import switchboard.Switches

class Experiments(implicit val switches: Switches) {

  object CommercialClientLogging extends Experiment(
    name = "payment-flow",
    description = "Redesign of the payment flow",
    segment = Segment.Perc0A
  )

}