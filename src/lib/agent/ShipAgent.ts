  public processResponse(response: any): string {
    // Remove artificial truncation
    const content = response.choices[0].message.content.trim();
    return content;
  }