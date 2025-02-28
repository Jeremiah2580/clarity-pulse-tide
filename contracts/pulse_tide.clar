;; PulseTide - Live Event Feedback Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))
(define-constant err-invalid-feedback (err u400))

;; Data Variables
(define-data-var event-counter uint u0)

;; Data Maps
(define-map events 
  uint 
  {
    name: (string-ascii 64),
    description: (string-ascii 256),
    creator: principal,
    timestamp: uint,
    active: bool
  }
)

(define-map feedback-entries
  {event-id: uint, user: principal}
  {
    sentiment: (string-ascii 16),
    comment: (string-ascii 140),
    timestamp: uint
  }
)

;; Public Functions
(define-public (create-event (name (string-ascii 64)) (description (string-ascii 256)) (timestamp uint))
  (let ((event-id (+ (var-get event-counter) u1)))
    (begin
      (map-set events 
        event-id
        {
          name: name,
          description: description,
          creator: tx-sender,
          timestamp: timestamp,
          active: true
        }
      )
      (var-set event-counter event-id)
      (ok event-id)
    )
  )
)

(define-public (submit-feedback (event-id uint) (sentiment (string-ascii 16)) (comment (string-ascii 140)))
  (let ((event (unwrap! (map-get? events event-id) err-not-found)))
    (if (get active event)
      (begin
        (map-set feedback-entries
          {event-id: event-id, user: tx-sender}
          {
            sentiment: sentiment,
            comment: comment,
            timestamp: block-height
          }
        )
        (ok true)
      )
      err-unauthorized
    )
  )
)

;; Read Only Functions
(define-read-only (get-event-details (event-id uint))
  (ok (unwrap! (map-get? events event-id) err-not-found))
)

(define-read-only (get-user-feedback (event-id uint) (user principal))
  (ok (unwrap! (map-get? feedback-entries {event-id: event-id, user: user}) err-not-found))
)
