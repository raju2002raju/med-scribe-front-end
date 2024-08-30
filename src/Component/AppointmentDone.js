import React from 'react'

const AppointmentDone = ({ContactId, name, email, phone}) => {

  const AppointmentDone = 'True'
    const handleClick = async () => {
        const webhookUrl = 'https://backend.leadconnectorhq.com/hooks/UnlBXa9kHr1F27UlYOKj/webhook-trigger/45927f6b-6885-4ac7-ad3f-7310161c431c';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ContactId, name, email, phone, AppointmentDone}), 
            });
            console.log(ContactId, name , email, phone, AppointmentDone )
            
            if (!response.ok) {
                throw new Error('Failed to send webhook data');
            }

            console.log('Webhook data sent successfully');
        } catch (error) {
            console.error('Error sending webhook data:', error.message);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Appointment Done</button>
        </div>
    );
};


export default AppointmentDone
