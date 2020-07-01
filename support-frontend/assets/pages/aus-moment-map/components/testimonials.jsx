// @flow

// ----- Imports ----- //
import React from 'react';
import type { AuState } from 'helpers/internationalisation/country';

type Testimonial = {
  name: string,
  city: string,
  body: string,
}

type TestimonialsCollection = {
  [AuState]: Array<Testimonial>
}

// ----- Render ----- //
export const Testimonials = () => {
  const [supporters, setSupporters] = React.useState(0)
  const [testimonials, setTestimonials] = React.useState<TestimonialsCollection>(null)

  const supportersCountEndpoint = '/supporters-ticker.json'
  const testimonialsEndpoint = 'https://interactive.guim.co.uk/docsdata/18tKS4fsHcEo__gdAwp3UySA3-FVje72_adHBZBhWjXE.json'

  React.useEffect(() => {
    fetch(testimonialsEndpoint)
      .then(response => response.json())
      .then(data => data['sheets'])
      .then(testimonialsData => setTestimonials(testimonialsData))
  }, [])

  React.useEffect(() => {
    fetch(supportersCountEndpoint)
      .then(response => response.json())
      .then(data => setSupporters(data.total));
  }, [])

  console.log(testimonials)

  return (
    <div>
      <div className="testimonials">
        <h2 className="blurb">Hear from Guardian supporters across Australia</h2>
        <p className="blurb">
          Our supporters are doing something powerful. As our readership grows, more people are supporting Guardian
          journalism than ever before. But what drives this support? We asked readers across every state to share their
          reasons with us – and here is a selection. You can become a supporter this winter and add to the conversation.
        </p>
        <p className="supporters-total">{supporters.toLocaleString()}</p>
        <p className="supporters-total-caption">Total supporters in Australia</p>
      </div>
    </div>
  )
}
