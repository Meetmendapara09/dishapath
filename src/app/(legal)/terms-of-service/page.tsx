export default function TermsOfServicePage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <h2>1. Terms</h2>
      <p>By accessing the website at Lakshya360, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

      <h2>2. Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on Lakshya360's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h2>3. Disclaimer</h2>
      <p>The materials on Lakshya360's website are provided on an 'as is' basis. Lakshya360 makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

      <h2>4. Limitations</h2>
      <p>In no event shall Lakshya360 or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Lakshya360's website.</p>

      <h2>5. Governing Law</h2>
      <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
    </>
  );
}
