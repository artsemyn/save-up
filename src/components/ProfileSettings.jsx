function ProfileSettings({ profile, onProfileChange }) {
  function handleChange(event) {
    const { name, value } = event.target

    onProfileChange({
      ...profile,
      [name]: value,
    })
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      onProfileChange({
        ...profile,
        photo: reader.result,
      })
    }

    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    onProfileChange({
      ...profile,
      photo: '',
    })
  }

  return (
    <section className="profile-card">
      <div>
        <h2>Profil</h2>
        <p>Atur nama dan foto profil. Mata uang aplikasi memakai Rupiah.</p>
      </div>

      <div className="profile-photo-field">
        <div className="profile-photo-preview">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.userName || 'Profil'} />
          ) : (
            <span>{profile.userName.slice(0, 1) || 'U'}</span>
          )}
        </div>

        <div className="profile-photo-actions">
          <label>
            Foto Profil
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>

          {profile.photo && (
            <button type="button" onClick={handleRemovePhoto}>
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <label>
          Nama Pengguna
          <input
            type="text"
            name="userName"
            value={profile.userName}
            onChange={handleChange}
            placeholder="Nama kamu"
          />
        </label>
      </div>
    </section>
  )
}

export default ProfileSettings
