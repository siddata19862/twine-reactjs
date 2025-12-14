import { useState, useEffect } from "react";
import "./AsyncButton.css";

export default function AsyncButton({
  caption,
  hook,
  payload,
  success = "Success!",
  error,
  className = "",
  buttonClassName = "",

  
  icon = null,          // e.g. "ri-user-add-line"
  iconClass = "",       // e.g. "text-success", "text-danger", custom class

  lockOnLoad = false
}) {
  const { mutate, isPending, isSuccess, isError, error: mutationError } = hook();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [freezeLoading, setFreezeLoading] = useState(false);

  const handleClick = () => {
    mutate(payload);
    if (lockOnLoad) setFreezeLoading(true);
  };

  useEffect(() => {
    if (!lockOnLoad && isSuccess) {
      setShowSuccess(true);
      setShowError(false);
    }
  }, [isSuccess, lockOnLoad]);

  useEffect(() => {
    if (isError) {
      const finalErrorMsg =
        error !== undefined
          ? error || "Error!"
          : mutationError?.response?.data?.message ||
            mutationError?.message ||
            "Something went wrong";

      setErrorMsg(finalErrorMsg);
      setShowError(true);
      setShowSuccess(false);
      setFreezeLoading(false);
    }
  }, [isError, mutationError, error]);

  const showLoader = isPending || freezeLoading;

  return (
    <div className={`async-wrap ${className}`}>

      {/* SUCCESS */}
      {!lockOnLoad && showSuccess && (
        <div className="async-success-parent">
          <div className="async-success fade-up">{success}</div>
        </div>
      )}

      {/* ERROR */}
      {showError && (
        <div className="async-error-parent">
          <div className="async-error fade-up">
            <i className="ri-error-warning-line me-2"></i>
            {errorMsg}
          </div>
        </div>
      )}

      {/* BUTTON */}
      {!showSuccess && !showError && (
        <button
          className={buttonClassName}
          disabled={showLoader}
          onClick={handleClick}
        >
          {showLoader ? (
            <div className="three-dots-loader">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <>
              {icon && (
                <i className={`${icon} ${iconClass}`}></i>
              )}
              {caption}
            </>
          )}
        </button>
      )}
    </div>
  );
}