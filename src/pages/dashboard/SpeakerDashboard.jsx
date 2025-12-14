import SpeakersList from "../../components/speakers/SpeakersList";

export const SpeakerDashboard = () => {
  return (
    <div className="container pt-4">
      <h4 className="fw-bold mb-3 text-muted">Speakers</h4>

      <SpeakersList />
    </div>
  );
};
